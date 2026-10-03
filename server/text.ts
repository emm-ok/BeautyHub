import type { Request, Response, NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { prisma } from "./src/lib/prisma.js";
import { z } from "zod";
import { Prisma, ProductCategory, ProductConcern, SkinType } from "@prisma/client";


declare global {
    namespace Express {
        interface Request {
            user?: {
                clerkId: string
            }
        }
    }
}

export const requireAuthenticaton = (req: Request, res: Response, next: NextFunction) => {
    const { isAuthenticated, userId } = getAuth(req);

    try {
        if (!isAuthenticated || !userId) {
            return res.status(401).json({
                message: "Authentication required",
            })
        }

        req.user = { clerkId: userId };

        return next()
    } catch (error) {
        return res.status(500).json({
            message: "Authentication middleware error"
        })
    }
}

export { };



export async function getUserByClerkId(req: Request, res: Response) {
    try {
        const userId = req?.user?.clerkId;

        if (!userId) {
            return res.status(400).json({
                message: "User Id is required",
            })
        }

        async function ensureUserExists(clerkId: string) {
            if (!userId) {
                throw new Error("userId is required")
            }

            const existing = await prisma.user.findUnique({
                where: {
                    clerkId,
                }
            })

            if (existing) {
                return existing;;
            }

            const clerkUser = await clerkClient.users.getUser(clerkId);

            const primaryEmail = clerkUser.emailAddresses.find((email) =>
                email.id === clerkUser.primaryEmailAddressId
            )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress


            if (!primaryEmail) {
                throw new Error("Authentcated clerk user has no email")
            }

            const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() || null;

            return prisma.user.upsert({
                where: {
                    clerkId: clerkUser.id,
                },
                create: {
                    clerkId: clerkUser.id,
                    email: primaryEmail,
                    name,
                    status: "ACTIVE",
                },

                update: {
                    email: primaryEmail,
                    name,
                    deletedAt: null,
                }
            })
        }
        const user = ensureUserExists(userId);


        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })
        }

        return res.status(200).json({
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch clerk user"
        })
    }
}




export const productDiscoverySchema = z.object({
    concerns: z.array(z.enum(ProductConcern)).max(5).optional().default([]),

    skinType: z.enum(SkinType).optional(),

    category: z.enum(ProductCategory).optional(),

    maxBudget: z.number().positive().optional(),

    inStockOnly: z.boolean().optional().default(true),

    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().min(1).max(50).optional().default(12),
});

type ProductDiscoveryInput = z.infer<typeof productDiscoverySchema>;


export async function productDiscoveryController(req: Request, res: Resposne) {
    try {
        const filters = productDiscoverySchema.safeParse(req.body);

        if (!filters.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid filters",
                errors: filters.error.flatten(),
            })
        }

        const results = discoverProducts(filters.data);

        return res.status(200).json({
            data: results
        })
    } catch (error) {
        return res.status(500).json({
            message: "Product Discovery error"
        })
    }
}


async function discoverProducts(filters: ProductDiscoveryInput) {
    const {
        concerns,
        skinType,
        category,
        maxBudget,
        inStockOnly,
        page,
        limit
    } = filters;

    const where: Prisma.ProductWhereInput = {
        status: "ACTIVE",
        verificationStatus: "VERIFIED",

        category: {
            isActive: true,
        }
    }


    if (category) {
        where.category = {
            name: category,
        }
    }

    if (maxBudget !== undefined) {
        where.salePrice = {
            lte: maxBudget,
        }
    }

    if (inStockOnly) {
        where.stockQuantity = {
            gt: 0,
        }
    }

    if (concerns && concerns.length > 0) {
        where.concerns = {
            hasSome: concerns,
        }
    }

    if (skinType) {
        where.skinTypes = {
            hasSome: [skinType, "ALL"]
        }
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,

            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                images: {
                    select: {
                        id: true,
                        url: true,
                        altText: true,
                    },

                    orderBy: {
                        createdAt: "asc"
                    },

                    take: 1,
                }
            },

            orderBy: {
                createdAt: "desc"
            },
        }),

        prisma.product.count({ where })
    ]);

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPreviousPage: page > 1,
        }
    }
}

const createProductSchema = z.object({

})

async function createProductController(req: Request, res: Response) {
    try {
        const data = createProductSchema.parse(req.body);


        return prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                ...(data.brand !== undefined && { brand: data.brand }),

                categoryId: data.categoryId,

                discountType: data.discountType,
                ...(data.discountValue !== undefined && { discountValue: data.discountValue })
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create product"
        })
    }
}



async function getProducts(filters: ProductQueryInput) {
    const {
        search,
        categoryId,
        category,
        // status,
        // verificationStatus,
        minPrice,
        maxPrice,
        inStock,
        page,
        limit,
        sortBy,
        sortOrder,
    } = filters;

    const where: Prisma.ProductWhereInput = {
        status: "ACTIVE",
        verificationStatus: "VERIFIED"
    };

    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
                brand: {
                    contains: search,
                    mode: "insensitive",
                },
                description: {
                    contains: search,
                    mode: "insensitive",
                },
            }
        ]
    }

    if (categoryId) {
        where.categoryId = categoryId
    }

    if (category) {
        where.category = {
            name: category,
        }
    }

    if (minPrice) {
        where.salePrice = {
            gte: minPrice,
        }
    }

    if (maxPrice) {
        where.salePrice = {
            lte: maxPrice,
        }
    }

    if (inStock) {
        where.stockQuantity = {
            gt: 0,
        }
    }

    const skip = (page - 1) * limit;


    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,

            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                },
                images: {
                    select: {
                        id: true,
                        url: true,
                        altText: true,
                    },

                    orderBy: [
                        {
                            isPrimary: "desc"
                        },
                        {
                            sortOrder: "asc"
                        }
                    ],

                    take: 1

                },
            },
            orderBy: sortBy,
        }),

        prisma.product.count({where})
    ]);

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1
        }
    }
}   
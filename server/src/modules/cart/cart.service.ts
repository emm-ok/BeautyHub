import {
    Prisma,
    ProductStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma.js";

const cartInclude = {
    items: {
        orderBy: {
            createdAt: "asc" as const,
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    brand: true,
                    price: true,
                    salePrice: true,
                    stockQuantity: true,
                    status: true,
                    verificationStatus: true,
                    size: true,
                    unit: true,
                    images: {
                        where: {
                            isPrimary: true,
                        },
                        select: {
                            id: true,
                            url: true,
                            altText: true,
                        },
                        take: 1,
                    },
                },
            },
        },
    },
};

type CartWithItems = Prisma.CartGetPayload<{
    include: typeof cartInclude;
}>;

function serializeDecimal(value: Prisma.Decimal) {
    return value.toFixed(2);
}

function calculateCartResponse(cart: CartWithItems) {
    let subtotal = new Prisma.Decimal(0);
    let totalItems = 0;

    const items = cart.items.map((item) => {
        const unitPrice = item.product.salePrice;

        const lineTotal = unitPrice.mul(item.quantity);

        subtotal = subtotal.add(lineTotal);
        totalItems += item.quantity;

        return {
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,

            product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                brand: item.product.brand,

                price: serializeDecimal(item.product.price),
                salePrice: serializeDecimal(item.product.salePrice),

                stockQuantity: item.product.stockQuantity,
                status: item.product.status,
                verificationStatus:
                    item.product.verificationStatus,

                size: item.product.size,
                unit: item.product.unit,

                image: item.product.images[0] ?? null,
            },

            unitPrice: serializeDecimal(unitPrice),
            lineTotal: serializeDecimal(lineTotal),

            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    });

    return {
        id: cart.id,
        userId: cart.userId,

        items,

        summary: {
            totalItems,
            subtotal: serializeDecimal(subtotal),
            deliveryFee: "0.00",
            total: serializeDecimal(subtotal),
            currency: "NGN",
        },

        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
    };
}

/**
 * Find the BeautyHub user from the authenticated Clerk ID.
 */
async function getUserByClerkId(clerkId: string) {
    const user = await prisma.user.findUnique({
        where: {
            clerkId,
        },
        select: {
            id: true,
            status: true,
        },
    });

    if (!user) {
        throw new Error("User not found.");
    }

    if (user.status !== "ACTIVE") {
        throw new Error("Your account is not active.");
    }

    return user;
}

/**
 * Get the user's cart.
 *
 * If the customer does not have a cart yet,
 * one is created.
 */
export async function getCart(clerkId: string) {
    const user = await getUserByClerkId(clerkId);

    const cart = await prisma.cart.upsert({
        where: {
            userId: user.id,
        },
        create: {
            userId: user.id,
        },
        update: {},
        include: cartInclude,
    });

    return calculateCartResponse(cart);
}

/**
 * Add a product to the cart.
 *
 * If the product already exists:
 * existing quantity + requested quantity.
 */
export async function addCartItem(
    clerkId: string,
    productId: string,
    quantity: number
) {
    const user = await getUserByClerkId(clerkId);

    return prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                name: true,
                status: true,
                stockQuantity: true,
                salePrice: true,
            },
        });

        if (!product) {
            throw new Error("Product not found.");
        }

        if (product.status !== ProductStatus.ACTIVE) {
            throw new Error(
                "This product is currently unavailable."
            );
        }

        if (product.stockQuantity <= 0) {
            throw new Error(
                "This product is currently out of stock."
            );
        }

        const cart = await tx.cart.upsert({
            where: {
                userId: user.id,
            },
            create: {
                userId: user.id,
            },
            update: {},
        });

        const existingItem = await tx.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        const newQuantity =
            (existingItem?.quantity ?? 0) + quantity;

        if (newQuantity > product.stockQuantity) {
            throw new Error(
                `Only ${product.stockQuantity} item${product.stockQuantity === 1 ? "" : "s"
                } available.`
            );
        }

        if (existingItem) {
            await tx.cartItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: newQuantity,
                },
            });
        } else {
            await tx.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        const updatedCart = await tx.cart.findUniqueOrThrow({
            where: {
                id: cart.id,
            },
            include: cartInclude,
        });

        return calculateCartResponse(updatedCart);
    });
}

/**
 * Update an existing cart item quantity.
 */
export async function updateCartItem(
    clerkId: string,
    itemId: string,
    quantity: number
) {
    const user = await getUserByClerkId(clerkId);

    return prisma.$transaction(async (tx) => {
        const item = await tx.cartItem.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId: user.id,
                },
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        stockQuantity: true,
                    },
                },
            },
        });

        if (!item) {
            throw new Error("Cart item not found.");
        }

        if (item.product.status !== ProductStatus.ACTIVE) {
            throw new Error(
                "This product is currently unavailable."
            );
        }

        if (item.product.stockQuantity < quantity) {
            throw new Error(
                `Only ${item.product.stockQuantity} item${item.product.stockQuantity === 1 ? "" : "s"
                } available.`
            );
        }

        await tx.cartItem.update({
            where: {
                id: item.id,
            },
            data: {
                quantity,
            },
        });

        const updatedCart = await tx.cart.findUniqueOrThrow({
            where: {
                id: item.cartId,
            },
            include: cartInclude,
        });

        return calculateCartResponse(updatedCart);
    });
}

/**
 * Remove one item from the cart.
 */
export async function removeCartItem(
    clerkId: string,
    itemId: string
) {
    const user = await getUserByClerkId(clerkId);

    return prisma.$transaction(async (tx) => {
        const item = await tx.cartItem.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId: user.id,
                },
            },
            select: {
                id: true,
                cartId: true,
            },
        });

        if (!item) {
            throw new Error("Cart item not found.");
        }

        await tx.cartItem.delete({
            where: {
                id: item.id,
            },
        });

        const cart = await tx.cart.findUniqueOrThrow({
            where: {
                id: item.cartId,
            },
            include: cartInclude,
        });

        return calculateCartResponse(cart);
    });
}

/**
 * Remove every item from the cart.
 */
export async function clearCart(clerkId: string) {
    const user = await getUserByClerkId(clerkId);

    const cart = await prisma.cart.findUnique({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
        },
    });

    if (!cart) {
        return getCart(clerkId);
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
        },
    });

    return getCart(clerkId);
}
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/user/:path*",
    "/users/manage",
    "/products/:path*",

    // api routes
    "/api",
    "/api/product-qr/manage",
    "/api/products/:path*",
  ],
};

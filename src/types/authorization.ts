export { };

// Create a type for the roles
export type ClerkRoles = ["admin", "member", "user"];

export type Roles = "admin" | "member" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    };
  }
}



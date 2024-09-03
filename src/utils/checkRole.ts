import { Roles } from "@/types/authorization";
import { roles as ClerkRoles } from "@/constants/authorization";

// Utility function to extract the actual role string from a formatted string
export function extractString(role) {
  return role.replace("org:", "");
}

// Function to check the user's role
function checkUserRole(user) {
  let userRole = null;
  
  if (!user || !user.organizationMemberships || user.organizationMemberships.length === 0) {
    return null;
  }

  const organizationMemberships = user.organizationMemberships;

  for (const membership of organizationMemberships) {
    if (membership.role && ClerkRoles.includes(membership.role.toLowerCase())) {
      userRole = extractString(membership.role.toLowerCase());
      break;
    }
  }

  return userRole;
}

// Function to get the user's role
function getUserRole(user) {
  if (user && user.organizationMemberships && user.organizationMemberships.length > 0) {
    const role = user.organizationMemberships[0].role;
    if (role && ClerkRoles.includes(role.toLowerCase())) {
      return extractString(role.toLowerCase());
    }
  }
  
  return null;
}

export { checkUserRole, getUserRole };


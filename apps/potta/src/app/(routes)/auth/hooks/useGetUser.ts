import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api';
import { useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ContextData } from '@potta/components/context';

interface UserSession {
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  id: string;
}

interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  username: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  bio: string | null;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  twoFactorBackupCodes: string[] | null;
}

interface Organization {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  slug: string;
  logo: string;
  metadata: {
    industry: string;
  };
}

interface Branch {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  address: string;
  organization: Organization;
}

interface Member {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;
  role: {
    id: string;
    name: string;
    organizationId: string;
    branchId: string | null;
    permissions: {
      GROUP: Array<{
        name: string;
        properties: Array<{
          name: string;
          actions: string[];
        }>;
      }>;
      appNAME: string;
    };
  };
  teamId: string | null;
}

interface WhoAmIResponse {
  user: {
    session: UserSession;
    user: User;
    organization: {
      id: string;
      name: string;
      slug: string;
      logo?: string;
      metadata?: {
        industry?: string;
      };
    };
    roles: Array<{
      id: string;
      name: string;
      permissions: any;
    }>;
    hierarchy: {
      position: string;
      organization_structure: any;
      location: {
        id: string;
        location_name: string;
        address: string;
        longitude: string;
        latitude: string;
      };
      department: {
        id: string;
        name: string;
        type: string;
        level: number;
        path: string;
      };
      assignmentType: string;
      isActive: boolean;
      treePosition: any;
    };
  };
}

// Bypass routes that should not call the whoami endpoint
const BYPASS_AUTH_ROUTES = [
  '/vendor-portal',
  // Add more routes here as needed
];

const useGetUser = () => {
  const context = useContext(ContextData);
  const hasUpdatedContext = useRef(false);
  const pathname = usePathname();

  // Check if we're in dev mode
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

  // Check if we're on a bypass route
  const isBypassRoute = pathname
    ? BYPASS_AUTH_ROUTES.some((route) => pathname.includes(route))
    : false;

  // Check if we're on organigram page (special case - no whoami calls)
  const isOrganigramPage = pathname ? pathname.includes('/organigram') : false;

  const { data, isLoading, error } = useQuery({
    queryKey: ['whoami'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !devMode && !isBypassRoute && !isOrganigramPage, // Disable the query in dev mode, on bypass routes, and on organigram page
  });

  // Update context with user information when data is available
  useEffect(() => {
    if (
      (devMode || isBypassRoute || isOrganigramPage) &&
      context &&
      !hasUpdatedContext.current
    ) {
      // In dev mode, on bypass routes, or on organigram page, provide dummy data
      console.log(
        `useGetUser: ${
          devMode
            ? 'DEV MODE'
            : isBypassRoute
            ? 'BYPASS ROUTE'
            : 'ORGANIGRAM PAGE'
        } active – providing dummy user data`
      );

      const dummyCompanyInfo = {
        // Company/Organization Information
        companyName: 'Instanvi Inc',
        companyEmail: 'dev@instanvi.com',
        companyAddress: 'Quartre-etage, bonaberi, Douala',
        companyPhone: '+237 123 456 789',
        companyLogo: 'https://instanvi.com/logo.png',

        // User Information
        userFirstName: 'Dev',
        userLastName: 'User',
        userEmail: 'dev@instanvi.com',
        userRole: 'developer',
        userUsername: 'devuser',
        userPhone: '+237 123 456 789',
        userImage: null,
        userBio: 'Development user',
        userIsEmailVerified: true,
        userTwoFactorEnabled: false,

        // Branch Information
        branchName: 'Headquarters',
        branchAddress: 'Quartre-etage, bonaberi, Douala',
        branchId: 'dev-branch-id',

        // Organization Information
        organizationName: 'Instanvi Inc',
        organizationSlug: 'instanvi-inc',
        organizationLogo: 'https://instanvi.com/logo.png',
        organizationIndustry: 'Tech',
        organizationId: 'dev-org-id',

        // Session Information
        sessionToken: 'dev-session-token',
        sessionExpiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        sessionUserId: 'dev-user-id',

        // User Permissions (dummy permissions)
        userPermissions: [
          {
            roleName: 'Developer',
            roleId: 'dev-role-id',
            permissions: {
              GROUP: [
                {
                  name: 'General',
                  properties: [
                    {
                      name: 'invoices',
                      actions: ['create', 'read', 'update', 'delete'],
                    },
                    {
                      name: 'customers',
                      actions: ['create', 'read', 'update', 'delete'],
                    },
                  ],
                },
              ],
              appNAME: 'potta',
            },
            teamId: 'dev-team-id',
          },
        ],

        // Full user data for advanced usage
        fullUserData: {
          session: {
            token: 'dev-session-token',
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            userId: 'dev-user-id',
          },
          user: {
            firstName: 'Dev',
            lastName: 'User',
            email: 'dev@instanvi.com',
            role: 'developer',
          },
          branch: {
            name: 'Headquarters',
            address: 'Quartre-etage, bonaberi, Douala',
            organization: {
              name: 'Instanvi Inc',
              logo: 'https://instanvi.com/logo.png',
            },
          },
          members: [],
        },
      };

      // Update context with dummy user data
      context.setData((prevData: any) => {
        const newData = {
          ...prevData,
          ...dummyCompanyInfo,
        };
        console.log('Updated context with dummy user data:', newData);
        return newData;
      });

      hasUpdatedContext.current = true;
    } else if (data && context && !hasUpdatedContext.current) {
      const userData = data as WhoAmIResponse;

      // Extract comprehensive company and user information from the user data
      const companyInfo = {
        // Company/Organization Information
        companyName: userData.user.organization?.name || 'Unknown Company',
        companyEmail: userData.user.user?.email || 'No email',
        companyAddress:
          userData.user.hierarchy?.location?.address || 'No address',
        companyPhone: userData.user.user?.phone || 'No phone',
        companyLogo: userData.user.organization?.logo || null,

        // User Information
        userFirstName: userData.user.user?.firstName || 'Unknown',
        userLastName: userData.user.user?.lastName || 'User',
        userEmail: userData.user.user?.email || 'No email',
        userRole: userData.user.user?.role || 'user',
        userUsername: userData.user.user?.username || 'unknown',
        userPhone: userData.user.user?.phone || null,
        userImage: userData.user.user?.image || null,
        userBio: userData.user.user?.bio || null,
        userIsEmailVerified: userData.user.user?.isEmailVerified || false,
        userTwoFactorEnabled: userData.user.user?.twoFactorEnabled || false,

        // Branch Information (from hierarchy)
        branchName:
          userData.user.hierarchy?.department?.name || 'Unknown Department',
        branchAddress:
          userData.user.hierarchy?.location?.address || 'No address',
        branchId: userData.user.hierarchy?.department?.id || null,

        // Organization Information
        organizationName:
          userData.user.organization?.name || 'Unknown Organization',
        organizationSlug: userData.user.organization?.slug || 'unknown',
        organizationLogo: userData.user.organization?.logo || null,
        organizationIndustry:
          userData.user.organization?.metadata?.industry || null,
        organizationId: userData.user.organization?.id || null,

        // Session Information
        sessionToken: userData.user.session?.token || null,
        sessionExpiresAt: userData.user.session?.expiresAt || null,
        sessionUserId: userData.user.session?.userId || null,

        // User Permissions (from roles array)
        userPermissions:
          userData.user.roles?.map((role) => ({
            roleName: role.name,
            roleId: role.id,
            permissions: role.permissions || {},
            teamId: null,
          })) || [],

        // Full user data for advanced usage
        fullUserData: userData.user,
      };

      // Update context with user/company information
      context.setData((prevData: any) => {
        const newData = {
          ...prevData,
          ...companyInfo,
        };
        console.log('Updated context with user data:', newData);
        return newData;
      });

      // Mark that we've updated the context
      hasUpdatedContext.current = true;
    }
  }, [data, devMode, isBypassRoute, isOrganigramPage]); // Remove context from dependencies to prevent infinite loop

  return {
    data:
      devMode || isBypassRoute || isOrganigramPage
        ? undefined
        : (data as WhoAmIResponse | undefined),
    isLoading: devMode || isBypassRoute || isOrganigramPage ? false : isLoading,
    error: devMode || isBypassRoute || isOrganigramPage ? null : error,
  };
};

export default useGetUser;

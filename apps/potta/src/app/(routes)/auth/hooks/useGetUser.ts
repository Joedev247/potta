import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api';
import { useContext, useEffect, useRef } from 'react';
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
    branch: Branch;
    members: Member[];
  };
}

const useGetUser = () => {
  const context = useContext(ContextData);
  const hasUpdatedContext = useRef(false);

  // Check if we're in dev mode
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

  const { data, isLoading, error } = useQuery({
    queryKey: ['whoami'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !devMode, // Disable the query in dev mode
  });

  // Update context with user information when data is available
  useEffect(() => {
    if (devMode && context && !hasUpdatedContext.current) {
      // In dev mode, provide dummy data
      console.log('useGetUser: DEV MODE active – providing dummy user data');

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
        companyName: userData.user.branch.organization.name,
        companyEmail: userData.user.user.email,
        companyAddress: userData.user.branch.address,
        companyPhone: userData.user.user.phone || 'No phone',
        companyLogo: userData.user.branch.organization.logo,

        // User Information
        userFirstName: userData.user.user.firstName,
        userLastName: userData.user.user.lastName,
        userEmail: userData.user.user.email,
        userRole: userData.user.user.role,
        userUsername: userData.user.user.username,
        userPhone: userData.user.user.phone,
        userImage: userData.user.user.image,
        userBio: userData.user.user.bio,
        userIsEmailVerified: userData.user.user.isEmailVerified,
        userTwoFactorEnabled: userData.user.user.twoFactorEnabled,

        // Branch Information
        branchName: userData.user.branch.name,
        branchAddress: userData.user.branch.address,
        branchId: userData.user.branch.id,

        // Organization Information
        organizationName: userData.user.branch.organization.name,
        organizationSlug: userData.user.branch.organization.slug,
        organizationLogo: userData.user.branch.organization.logo,
        organizationIndustry:
          userData.user.branch.organization.metadata?.industry,
        organizationId: userData.user.branch.organization.id,

        // Session Information
        sessionToken: userData.user.session.token,
        sessionExpiresAt: userData.user.session.expiresAt,
        sessionUserId: userData.user.session.userId,

        // User Permissions (from members array)
        userPermissions: userData.user.members.map((member) => ({
          roleName: member.role.name,
          roleId: member.role.id,
          permissions: member.role.permissions,
          teamId: member.teamId,
        })),

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
  }, [data, devMode]); // Remove context from dependencies to prevent infinite loop

  return {
    data: devMode ? undefined : (data as WhoAmIResponse | undefined),
    isLoading: devMode ? false : isLoading,
    error: devMode ? null : error,
  };
};

export default useGetUser;

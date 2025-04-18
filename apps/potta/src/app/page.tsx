import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@potta/components/card';
import { Button } from '@potta/components/shadcn/button';
import { ScrollArea } from '@potta/components/shadcn/scroll-area';
import {
  Bell,
  Inbox as InboxIcon,
  Mail,
  AlertCircle,
  ArrowRight,
  Hand,
} from 'lucide-react';
import RootLayout from '../app/(routes)/layout';

// --- Custom SVG Icons ---

// Existing Icons (Payments, Expenses, Vouchers, POS, Invoice, Taxation, Reports - remain the same)
const PaymentsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-14 w-14"
  >
    <rect
      x="1"
      y="7"
      width="18"
      height="12"
      rx="2"
      fill="#60a5fa"
      stroke="#1e40af"
      strokeWidth="0.5"
    />
    <rect x="1" y="9" width="18" height="3" fill="#3b82f6" />
    <rect x="4" y="13" width="4" height="3" rx="0.5" fill="#bfdbfe" />
    <line x1="4" y1="17" x2="14" y2="17" stroke="#bfdbfe" strokeWidth="1" />
    <path
      d="M17 11l4 4-4 4"
      stroke="#1e40af"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="10"
      y1="15"
      x2="21"
      y2="15"
      stroke="#1e40af"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const ExpensesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-14 w-14"
  >
    <path
      d="M3 3v18l3-2 3 2 3-2 3 2 3-2 3 2V3H3z"
      fill="#fdba74"
      stroke="#c2410c"
      strokeWidth="0.5"
    />
    <line x1="7" y1="7" x2="17" y2="7" stroke="#f97316" strokeWidth="1" />
    <line x1="7" y1="10" x2="17" y2="10" stroke="#f97316" strokeWidth="1" />
    <line x1="7" y1="13" x2="13" y2="13" stroke="#f97316" strokeWidth="1" />
    <rect x="6" y="16" width="12" height="4" rx="1" fill="#fed7aa" />
    <line x1="8" y1="18" x2="16" y2="18" stroke="#f97316" strokeWidth="1.5" />
    <path
      d="M3 21 l3 -2 l3 2 l3 -2 l3 2 l3 -2 l3 2"
      stroke="#c2410c"
      strokeWidth="0.5"
      fill="none"
    />
  </svg>
);
const VouchersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-14 w-14"
  >
    <path
      d="M4 4h16v6.5a3.5 3.5 0 0 1-7 0 3.5 3.5 0 0 1-7 0V4z"
      fill="#c084fc"
      stroke="#6b21a8"
      strokeWidth="0.5"
    />
    <path
      d="M4 13.5a3.5 3.5 0 0 1 7 0 3.5 3.5 0 0 1 7 0V20H4v-6.5z"
      fill="#d8b4fe"
      stroke="#6b21a8"
      strokeWidth="0.5"
    />
    <line
      x1="4"
      y1="12"
      x2="20"
      y2="12"
      stroke="#6b21a8"
      strokeDasharray="2 2"
      strokeWidth="1"
    />
    <path
      d="M12 6l1.09 2.21.47 1 1.1.16 2.42.35-1.75 1.7-.34.33.08.46.41 2.41-2.17-1.14-.4-.21-.4.21-2.17 1.14.41-2.41.08-.46-.34-.33-1.75-1.7 2.42-.35 1.1-.16.47-1L12 6z"
      fill="#f3e8ff"
    />
  </svg>
);
const POSIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-14 w-14"
  >
    <rect
      x="3"
      y="2"
      width="18"
      height="14"
      rx="2"
      fill="#a5b4fc"
      stroke="#3730a3"
      strokeWidth="0.5"
    />
    <rect x="5" y="4" width="14" height="8" rx="1" fill="#e0e7ff" />
    <line x1="7" y1="7" x2="17" y2="7" stroke="#6366f1" strokeWidth="1" />
    <line x1="7" y1="10" x2="12" y2="10" stroke="#6366f1" strokeWidth="1" />
    <rect
      x="1"
      y="17"
      width="22"
      height="5"
      rx="1"
      fill="#6366f1"
      stroke="#3730a3"
      strokeWidth="0.5"
    />
    <rect x="4" y="18" width="16" height="1" fill="#a5b4fc" />
    <circle cx="7" cy="14" r="1" fill="#6366f1" />
    <circle cx="12" cy="14" r="1" fill="#6366f1" />
    <circle cx="17" cy="14" r="1" fill="#6366f1" />
  </svg>
);
const InvoiceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-14 w-14"
  >
    <path
      d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
      fill="#67e8f9"
      stroke="#0e7490"
      strokeWidth="0.5"
    />
    <polyline
      points="14 2 14 8 20 8"
      fill="#22d3ee"
      stroke="#0e7490"
      strokeWidth="0.5"
    />
    <line x1="9" y1="13" x2="15" y2="13" stroke="#0e7490" strokeWidth="1" />
    <line x1="9" y1="16" x2="15" y2="16" stroke="#0e7490" strokeWidth="1" />
    <line x1="9" y1="19" x2="13" y2="19" stroke="#0e7490" strokeWidth="1" />
    <circle
      cx="17"
      cy="18"
      r="3"
      fill="none"
      stroke="#155e75"
      strokeWidth="1"
    />
    <path d="M16 17l2 2m0-2l-2 2" stroke="#155e75" strokeWidth="1" />
  </svg>
);
const TaxationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-14 w-14"
  >
    <path
      d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
      fill="#fcd34d"
      stroke="#a16207"
      strokeWidth="0.5"
    />
    <circle cx="10" cy="10" r="1.5" fill="#a16207" />
    <circle cx="14" cy="14" r="1.5" fill="#a16207" />
    <line x1="9" y1="15" x2="15" y2="9" stroke="#a16207" strokeWidth="1.5" />
    <line x1="12" y1="5" x2="12" y2="8" stroke="#fef08a" strokeWidth="0.5" />
    <line x1="8" y1="7" x2="10" y2="9" stroke="#fef08a" strokeWidth="0.5" />
    <line x1="16" y1="7" x2="14" y2="9" stroke="#fef08a" strokeWidth="0.5" />
  </svg>
);
const ReportsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-14 w-14"
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="2"
      fill="#86efac"
      stroke="#15803d"
      strokeWidth="0.5"
    />
    <rect x="6" y="14" width="3" height="4" fill="#16a34a" />
    <rect x="10.5" y="10" width="3" height="8" fill="#16a34a" />
    <rect x="15" y="16" width="3" height="2" fill="#16a34a" />
    <polyline
      points="6 8 9 6 15 9 18 7"
      fill="none"
      stroke="#15803d"
      strokeWidth="1.5"
    />
    <line x1="4" y1="19" x2="20" y2="19" stroke="#15803d" strokeWidth="1" />
    <line x1="5" y1="4" x2="5" y2="19" stroke="#15803d" strokeWidth="1" />
  </svg>
);

// ** NEW ** Money Accounts Icon
const MoneyAccountsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-14 w-14"
  >
    {/* Ledger/Book */}
    <path
      d="M4 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
      fill="#99f6e4"
      stroke="#0f766e"
      strokeWidth="0.5"
    />
    <line x1="10" y1="2" x2="10" y2="22" stroke="#0f766e" strokeWidth="0.5" />{' '}
    {/* Spine */}
    {/* Lines on page */}
    <line x1="12" y1="7" x2="18" y2="7" stroke="#14b8a6" strokeWidth="1" />
    <line x1="12" y1="11" x2="18" y2="11" stroke="#14b8a6" strokeWidth="1" />
    <line x1="12" y1="15" x2="18" y2="15" stroke="#14b8a6" strokeWidth="1" />
    {/* Dollar Sign on the cover */}
    <path
      d="M7 12h-1a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2a2 2 0 0 1 0 4H6"
      stroke="#0f766e"
      strokeWidth="1.5"
      fill="none"
    />
    <line x1="6.5" y1="7" x2="6.5" y2="15" stroke="#0f766e" strokeWidth="1.5" />
  </svg>
);

// --- Component Logic ---
interface GridItem {
  value: string;
  label: string;
  icon: React.ElementType;
  colorClass: string;
}
interface ListItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  read?: boolean;
}
const inboxItems: ListItem[] = [
  /* ... data */
];
const notificationItems: ListItem[] = [
  /* ... data */
];
const gridItems: GridItem[] = [
  /* ... data */
];
const colorMap: {
  [key: string]: { hoverBg: string; text: string; readIndicator: string };
} = {
  /* ... data */
};

// Re-populate data (same as previous version, except for Accounts icon)
inboxItems.length = 0;
inboxItems.push(
  {
    id: 'msg1',
    title: 'Project Update',
    description: 'Alice sent an update on Project Phoenix.',
    icon: Mail,
    read: false,
  },
  {
    id: 'msg2',
    title: 'Meeting Reminder',
    description: 'Meeting with the design team at 2 PM.',
    icon: Mail,
    read: false,
  },
  {
    id: 'msg3',
    title: 'Invoice Received',
    description: 'Invoice #INV-123 from Bob.',
    icon: Mail,
    read: true,
  },
  {
    id: 'msg4',
    title: 'Team Lunch',
    description: 'Planning team lunch for Friday.',
    icon: Mail,
    read: true,
  }
);
notificationItems.length = 0;
notificationItems.push(
  {
    id: 'not1',
    title: 'Server Maintenance',
    description: 'Scheduled maintenance tonight at 1 AM.',
    icon: AlertCircle,
    read: false,
  },
  {
    id: 'not2',
    title: 'New Login',
    description: 'A new device logged into your account.',
    icon: AlertCircle,
    read: false,
  },
  {
    id: 'not3',
    title: 'Password Expiring',
    description: 'Your password expires in 3 days.',
    icon: AlertCircle,
    read: true,
  },
  {
    id: 'not4',
    title: 'Report Ready',
    description: 'Monthly sales report is available.',
    icon: AlertCircle,
    read: true,
  },
  {
    id: 'not5',
    title: 'Task Assigned',
    description: 'You were assigned a new task: Review PR #42.',
    icon: AlertCircle,
    read: true,
  }
);
gridItems.length = 0;
gridItems.push(
  {
    value: 'payments',
    label: 'Payments',
    icon: PaymentsIcon,
    colorClass: 'blue',
  },
  {
    value: 'expenses',
    label: 'Expenses',
    icon: ExpensesIcon,
    colorClass: 'orange',
  },
  {
    value: 'vouchers',
    label: 'Vouchers',
    icon: VouchersIcon,
    colorClass: 'purple',
  },
  { value: 'pos', label: 'POS', icon: POSIcon, colorClass: 'indigo' },
  { value: 'invoice', label: 'Invoice', icon: InvoiceIcon, colorClass: 'cyan' },
  {
    value: 'taxation',
    label: 'Taxation',
    icon: TaxationIcon,
    colorClass: 'yellow',
  },
  {
    value: 'reports',
    label: 'Reports',
    icon: ReportsIcon,
    colorClass: 'green',
  },
  // ** UPDATED ** Use the new icon here
  {
    value: 'accounts',
    label: 'Accounts',
    icon: MoneyAccountsIcon,
    colorClass: 'teal',
  }
);
Object.keys(colorMap).forEach((key) => delete colorMap[key]);
Object.assign(colorMap, {
  blue: {
    hoverBg: 'hover:bg-blue-50',
    text: 'text-blue-600',
    readIndicator: 'bg-blue-500',
  },
  orange: {
    hoverBg: 'hover:bg-orange-50',
    text: 'text-orange-600',
    readIndicator: 'bg-orange-500',
  },
  purple: {
    hoverBg: 'hover:bg-purple-50',
    text: 'text-purple-600',
    readIndicator: 'bg-purple-500',
  },
  indigo: {
    hoverBg: 'hover:bg-indigo-50',
    text: 'text-indigo-600',
    readIndicator: 'bg-indigo-500',
  },
  cyan: {
    hoverBg: 'hover:bg-cyan-50',
    text: 'text-cyan-600',
    readIndicator: 'bg-cyan-500',
  },
  yellow: {
    hoverBg: 'hover:bg-yellow-50',
    text: 'text-yellow-600',
    readIndicator: 'bg-yellow-500',
  },
  green: {
    hoverBg: 'hover:bg-green-50',
    text: 'text-green-600',
    readIndicator: 'bg-green-500',
  },
  teal: {
    hoverBg: 'hover:bg-teal-50',
    text: 'text-teal-600',
    readIndicator: 'bg-teal-500',
  },
});

const WelcomePage = () => {
  return (
    <RootLayout>
      <div className="p-6 pl-16 space-y-8 bg-white min-h-screen">
        {/* Welcome Banner (Accent Style - Same as previous) */}
        <div className=" pl-4 py-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-medium text-slate-800">
              Welcome Back!
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Ready to tackle your tasks for today?
          </p>
        </div>

        {/* Inbox and Notifications Cards (Same as previous clean version) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inbox Card */}
          <Card className="shadow overflow-hidden flex flex-col bg-white border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-700">
                Recent Inbox
              </CardTitle>
              <InboxIcon className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent className="p-0 flex-grow flex flex-col">
              <ScrollArea className="flex-grow h-56">
                <div className="divide-y divide-slate-100">
                  {inboxItems.map((item) => {
                    const IconComponent = item.icon;
                    const styles = colorMap.blue;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 flex items-start space-x-3 hover:bg-slate-50 transition-colors ${
                          !item.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            !item.read ? 'text-blue-600' : 'text-slate-400'
                          } mt-1 flex-shrink-0`}
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium leading-tight ${
                              !item.read ? 'text-slate-800' : 'text-slate-600'
                            }`}
                          >
                            {item.title}
                          </p>
                          <p
                            className={`text-xs ${
                              !item.read ? 'text-slate-600' : 'text-slate-500'
                            } mt-0.5`}
                          >
                            {item.description}
                          </p>
                        </div>
                        {!item.read && (
                          <div
                            className={`h-2 w-2 rounded-full ${styles.readIndicator} mt-1 flex-shrink-0`}
                            title="Unread"
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="p-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                >
                  View All Inbox <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Notifications Card */}
          <Card className="shadow overflow-hidden flex flex-col bg-white border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-700">
                Notifications
              </CardTitle>
              <Bell className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent className="p-0 flex-grow flex flex-col">
              <ScrollArea className="flex-grow h-56">
                <div className="divide-y divide-slate-100">
                  {notificationItems.map((item) => {
                    const IconComponent = item.icon;
                    const styles = colorMap.orange;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 flex items-start space-x-3 hover:bg-slate-50 transition-colors ${
                          !item.read ? 'bg-orange-50/30' : ''
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            !item.read ? 'text-orange-600' : 'text-slate-400'
                          } mt-1 flex-shrink-0`}
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium leading-tight ${
                              !item.read ? 'text-slate-800' : 'text-slate-600'
                            }`}
                          >
                            {item.title}
                          </p>
                          <p
                            className={`text-xs ${
                              !item.read ? 'text-slate-600' : 'text-slate-500'
                            } mt-0.5`}
                          >
                            {item.description}
                          </p>
                        </div>
                        {!item.read && (
                          <div
                            className={`h-2 w-2 rounded-full ${styles.readIndicator} mt-1 flex-shrink-0`}
                            title="Unread"
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="p-3 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-orange-600 hover:bg-orange-100 hover:text-orange-700"
                >
                  View All Notifications <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Grid (Now uses MoneyAccountsIcon) */}
        <div>
          <h2 className="text-2xl font-semibold mb-5 text-slate-700">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {gridItems.map((item) => {
              const IconComponent = item.icon;
              const linkHref = `/${item.value}`;
              const styles = colorMap[item.colorClass] || colorMap.blue;
              return (
                <a
                  href={linkHref}
                  key={item.value}
                  className="block group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                >
                  <Card
                    className={`h-full overflow-hidden  bg-white border border-slate-200 ${styles.hoverBg} shadow-sm hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-1`}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center space-y-2 h-full">
                      <IconComponent />
                      <p
                        className={`text-sm font-semibold ${styles.text} transition-colors`}
                      >
                        {item.label}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default WelcomePage;

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
  CreditCard,
  Receipt,
  Ticket,
  ShoppingCart,
  FileText,
  Shield,
  ChartPie,
  Wallet,
  Banknote,
} from 'lucide-react';
import RootLayout from '../app/(routes)/layout';
import CustomNavbar from '@potta/components/custom-navbar';

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
  },
];

const notificationItems: ListItem[] = [
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
  },
];

const gridItems: GridItem[] = [
  {
    value: 'payments',
    label: 'Payments',
    icon: CreditCard,
    colorClass: 'black',
  },
  {
    value: 'expenses',
    label: 'Expenses',
    icon: Banknote,
    colorClass: 'black',
  },
  {
    value: 'vouchers',
    label: 'Vouchers',
    icon: Ticket,
    colorClass: 'black',
  },
  {
    value: 'pos',
    label: 'POS',
    icon: ShoppingCart,
    colorClass: 'black',
  },
  {
    value: 'invoice',
    label: 'Invoice',
    icon: FileText,
    colorClass: 'black',
  },
  {
    value: 'taxation',
    label: 'Taxation',
    icon: Shield,
    colorClass: 'black',
  },
  {
    value: 'reports',
    label: 'Reports',
    icon: ChartPie,
    colorClass: 'black',
  },
  {
    value: 'accounts',
    label: 'Accounts',
    icon: Wallet,
    colorClass: 'black',
  },
];

const colorMap: {
  [key: string]: { hoverBg: string; text: string; readIndicator: string };
} = {
  black: {
    hoverBg: 'hover:bg-green-50',
    text: 'text-black',
    readIndicator: 'bg-green-50',
  },
};

const WelcomePage = () => {
  return (
    <RootLayout>
      {/* <HeadlessNavbar /> */}
      <CustomNavbar />
      <div className="p-6 space-y-8 bg-white min-h-screen">
        {/* Welcome Banner */}
        <div className=" py-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-medium text-slate-800">
              Welcome Back!
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Ready to tackle your tasks for today?
          </p>
        </div>

        {/* Inbox and Notifications Cards */}
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
                            className={`h-2 w-2 rounded-full  mt-1 flex-shrink-0`}
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
                            className={`h-2 w-2 rounded-full  mt-1 flex-shrink-0`}
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

        {/* Quick Access Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-slate-700">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
            {gridItems.map((item) => {
              const IconComponent = item.icon;
              const linkHref = `/${item.value}`;
              const styles = colorMap[item.colorClass] || colorMap.blue;
              return (
                <a
                  href={linkHref}
                  key={item.value}
                  className="block group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Card
                    className={`h-full py-8 overflow-hidden bg-white border border-slate-200 ${styles.hoverBg} shadow-sm hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-1`}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center space-y-2 h-full">
                      <IconComponent className={`h-14 w-14 ${styles.text}`} />
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

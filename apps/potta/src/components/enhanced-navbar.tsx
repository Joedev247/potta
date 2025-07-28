'use client';
import React, { useState, useContext } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Inbox,
  Bell,
  Menu,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ContextData } from './context';
import Select from './select';
import { useAuth } from '../app/(routes)/auth/AuthContext';

export type MenuItem = {
  title: string;
  children?: MenuItem[];
  href?: string;
};

// Helper to slugify titles for hrefs
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

// Sidebar options for switching
const sidebarOptions = [
  { value: 'default', label: 'Default Sidebar' },
  { value: 'payments', label: 'Payments Sidebar' },
  { value: 'expenses', label: 'Expenses Sidebar' },
  { value: 'invoice', label: 'Invoice Sidebar' },
  { value: 'pos', label: 'POS Sidebar' },
  { value: 'payroll', label: 'Payroll Sidebar' },
  { value: 'accounts', label: 'Accounts Sidebar' },
  { value: 'reports', label: 'Reports Sidebar' },
];

const EnhancedNavbar = () => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const pathname = usePathname();
  const context = useContext(ContextData);
  const { signOut } = useAuth();

  const isHome = pathname === '/';

  // Get current page title
  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return 'Dashboard';

    const lastSegment = pathSegments[pathSegments.length - 1];
    return (
      lastSegment.charAt(0).toUpperCase() +
      lastSegment.slice(1).replace(/-/g, ' ')
    );
  };

  const handleSidebarChange = (value: string) => {
    context?.setActiveSidebar(value);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Sidebar Toggle */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => context?.setToggle(!context.toggle)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/images/pottaLogo.svg"
                alt="Potta Logo"
                className="h-8 w-auto"
              />
            </Link>

            {/* Page Title */}
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Center - Navigation Menu (hidden on mobile) */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/payments"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Payments
            </Link>
            <Link
              href="/expenses"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Expenses
            </Link>
            <Link
              href="/account_receivables"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Invoice
            </Link>
            <Link
              href="/pos"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              POS
            </Link>
            <Link
              href="/payroll"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Payroll
            </Link>
          </div>

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSidebarMenu(!showSidebarMenu)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <span>Sidebar</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showSidebarMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {sidebarOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleSidebarChange(option.value);
                          setShowSidebarMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          context?.activeSidebar === option.value
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Inbox */}
            <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Inbox className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to sign out?')) {
                          signOut();
                        }
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu (simplified) */}
      <div className="lg:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/payments"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Payments
          </Link>
          <Link
            href="/expenses"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Expenses
          </Link>
          <Link
            href="/account_receivables"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Invoice
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavbar;

'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Inbox, Bell } from 'lucide-react';
import Link from 'next/link';

type MenuItem = {
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

// Helper to build href recursively
const buildHref = (parents: string[], title: string) =>
  '/' + [...parents, slugify(title)].join('/');

const CustomNavbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuStructure: MenuItem[] = [
    {
      title: 'Home',
      children: [
        { title: 'Dashboard', href: '/home/dashboard' },
        { title: 'Customer Dashboard', href: '/home/customer-dashboard' },
        { title: 'Supplier Dashboard', href: '/home/supplier-dashboard' },
        { title: 'Item Dashboard', href: '/home/item-dashboard' },
        { title: 'Financial Dashboard', href: '/home/financial-dashboard' },
        { title: 'My Workplace', href: '/home/my-workplace' },
      ],
    },
    {
      title: 'Quick action',
      children: [
        { title: 'Customers', href: '/quick-action/customers' },
        { title: 'Suppliers', href: '/quick-action/suppliers' },
        { title: 'Items', href: '/quick-action/items' },
        { title: 'Bank Accounts', href: '/quick-action/bank-accounts' },
        { title: 'Accounts', href: '/quick-action/accounts' },
      ],
    },
    {
      title: 'Customers',
      children: [
        { title: 'Add Customer', href: '/customers/add-customer' },
        {
          title: 'List',
          children: [
            {
              title: 'List of Customers',
              href: '/customers/list/list-of-customers',
            },
            {
              title: 'List of Sales Reps',
              href: '/customers/list/list-of-sales-reps',
            },
          ],
        },
        {
          title: 'Transactions',
          children: [
            {
              title: 'Customer Quotes',
              href: '/customers/transactions/customer-quotes',
            },
            {
              title: 'Customer Sales Orders',
              href: '/customers/transactions/customer-sales-orders',
            },
            {
              title: 'Customer Tax Invoices',
              href: '/customers/transactions/customer-tax-invoices',
            },
            {
              title: 'Customer RCC Invoices',
              href: '/customers/transactions/customer-rcc-invoices',
            },
            {
              title: 'Customer Credit Notes',
              href: '/customers/transactions/customer-credit-notes',
            },
            {
              title: 'Customer Receipts',
              href: '/customers/transactions/customer-receipts',
            },
            {
              title: 'Allocate Receipts',
              href: '/customers/transactions/allocate-receipts',
            },
          ],
        },
        {
          title: 'Reports',
          children: [
            {
              title: 'Customer Statement Run',
              href: '/customers/reports/customer-statement-run',
            },
            {
              title: 'List of Customers',
              href: '/customers/reports/list-of-customers',
            },
            {
              title: 'Sales by Customers',
              href: '/customers/reports/sales-by-customers',
            },
            {
              title: 'Sales by Sales Rep',
              href: '/customers/reports/sales-by-sales-rep',
            },
            {
              title: 'Customer Balances',
              href: '/customers/reports/customer-balances',
            },
            {
              title: 'Customer Statements',
              href: '/customers/reports/customer-statements',
            },
            {
              title: 'Customer Transactions',
              href: '/customers/reports/customer-transactions',
            },
            {
              title: 'Customer Quotes',
              href: '/customers/reports/customer-quotes',
            },
            {
              title: 'Customer Quotes by Customer',
              href: '/customers/reports/customer-quotes-by-customer',
            },
            {
              title: 'Customer Sales Orders',
              href: '/customers/reports/customer-sales-orders',
            },
            {
              title: 'Customer Sales Order by Customer',
              href: '/customers/reports/customer-sales-order-by-customer',
            },
            {
              title: 'Customer Invoices',
              href: '/customers/reports/customer-invoices',
            },
            {
              title: 'Customer Unallocated Receipt',
              href: '/customers/reports/customer-unallocated-receipt',
            },
            {
              title: 'Customer Communication Report',
              href: '/customers/reports/customer-communication-report',
            },
          ],
        },
        { title: 'Special', href: '/customers/special' },
      ],
    },
    {
      title: 'Accountant Area',
      children: [
        {
          title: 'Send a Note to my Accountant',
          href: '/accountant-area/send-a-note-to-my-accountant',
        },
        {
          title: 'Process Journal Entries',
          href: '/accountant-area/process-journal-entries',
        },
        {
          title: 'Recurring Journal Entries',
          href: '/accountant-area/recurring-journal-entries',
        },
        {
          title: 'VAT',
          children: [
            {
              title: 'VAT Returns and Reports',
              href: '/accountant-area/vat/vat-returns-and-reports',
            },
            {
              title: 'VAT Adjustments',
              href: '/accountant-area/vat/vat-adjustments',
            },
            {
              title: 'VAT Payments and Returns',
              href: '/accountant-area/vat/vat-payments-and-returns',
            },
            {
              title: 'DRC VAT Allocations',
              href: '/accountant-area/vat/drc-vat-allocations',
            },
            {
              title: 'DRC VAT Statements',
              href: '/accountant-area/vat/drc-vat-statements',
            },
          ],
        },
        {
          title: 'Reports',
          children: [
            {
              title: 'Management Reports',
              children: [
                {
                  title: 'Profit and Loss',
                  href: '/accountant-area/reports/management-reports/profit-and-loss',
                },
                {
                  title: 'Balance Sheet',
                  href: '/accountant-area/reports/management-reports/balance-sheet',
                },
                {
                  title: 'Trial Balance',
                  href: '/accountant-area/reports/management-reports/trial-balance',
                },
                {
                  title: 'Budget Report',
                  href: '/accountant-area/reports/management-reports/budget-report',
                },
              ],
            },
            {
              title: 'Transaction Reports',
              children: [
                {
                  title: 'Journal Entries Reports',
                  href: '/accountant-area/reports/transaction-reports/journal-entries-reports',
                },
              ],
            },
            {
              title: 'Audit Reports',
              children: [
                {
                  title: 'Opening Balances and VAT Adjustments',
                  href: '/accountant-area/reports/audit-reports/opening-balances-and-vat-adjustments',
                },
                {
                  title: 'Audit Trail',
                  href: '/accountant-area/reports/audit-reports/audit-trail',
                },
                {
                  title: 'System Audit Trail',
                  href: '/accountant-area/reports/audit-reports/system-audit-trail',
                },
              ],
            },
          ],
        },
        {
          title: 'Trial Balance Report',
          href: '/accountant-area/trial-balance-report',
        },
      ],
    },
    {
      title: 'Suppliers',
      children: [
        { title: 'Add Supplier', href: '/suppliers/add-supplier' },
        {
          title: 'List',
          children: [
            {
              title: 'List of Customers',
              href: '/suppliers/list/list-of-customers',
            },
            {
              title: 'List of Sales Reps',
              href: '/suppliers/list/list-of-sales-reps',
            },
          ],
        },
        {
          title: 'Transactions',
          children: [
            {
              title: 'Supplier Purchase Orders',
              href: '/suppliers/transactions/supplier-purchase-orders',
            },
            {
              title: 'Supplier Invoices',
              href: '/suppliers/transactions/supplier-invoices',
            },
            {
              title: 'Supplier Returns',
              href: '/suppliers/transactions/supplier-returns',
            },
            {
              title: 'Supplier Payments',
              href: '/suppliers/transactions/supplier-payments',
            },
            {
              title: 'Supplier Batch Payments',
              href: '/suppliers/transactions/supplier-batch-payments',
            },
            {
              title: 'Allocate Payments',
              href: '/suppliers/transactions/allocate-payments',
            },
            {
              title: 'Supplier Adjustments',
              href: '/suppliers/transactions/supplier-adjustments',
            },
          ],
        },
        {
          title: 'Reports',
          children: [
            {
              title: 'List of Suppliers',
              href: '/suppliers/reports/list-of-suppliers',
            },
            {
              title: 'Purchase by Supplier',
              href: '/suppliers/reports/purchase-by-supplier',
            },
            {
              title: 'Supplier Balances - Outstanding Days',
              href: '/suppliers/reports/supplier-balances-outstanding-days',
            },
            {
              title: 'Supplier Transactions',
              href: '/suppliers/reports/supplier-transactions',
            },
            {
              title: 'Supplier Statement',
              href: '/suppliers/reports/supplier-statement',
            },
            {
              title: 'Supplier Purchase Orders',
              href: '/suppliers/reports/supplier-purchase-orders',
            },
            {
              title: 'List of Purchase Orders by Suppliers',
              href: '/suppliers/reports/list-of-purchase-orders-by-suppliers',
            },
            {
              title: 'Supplier Invoices',
              href: '/suppliers/reports/supplier-invoices',
            },
            {
              title: 'Supplier Unallocated Payments',
              href: '/suppliers/reports/supplier-unallocated-payments',
            },
            {
              title: 'Email Sent to Suppliers',
              href: '/suppliers/reports/email-sent-to-suppliers',
            },
          ],
        },
        { title: 'Special', href: '/suppliers/special' },
      ],
    },
    {
      title: 'Items',
      children: [
        { title: 'Add Items', href: '/items/add-items' },
        { title: 'Lists', href: '/items/lists' },
        { title: 'Transactions', href: '/items/transactions' },
        { title: 'Special', href: '/items/special' },
        { title: 'Reports', href: '/items/reports' },
      ],
    },
    {
      title: 'Payroll',
      children: [
        { title: 'Employees', href: '/payroll/employees' },
        { title: 'Timesheets', href: '/payroll/timesheets' },
        { title: 'Payroll', href: '/payroll/payroll' },
        { title: 'Benefits', href: '/payroll/benefits' },
        { title: 'PTO', href: '/payroll/pto' },
        {
          title: 'Reports',
          children: [
            { title: 'Payslip', href: '/payroll/reports/payslip' },
            {
              title: 'List of Assets',
              href: '/payroll/reports/list-of-assets',
            },
            {
              title: 'Asset Categories',
              href: '/payroll/reports/asset-categories',
            },
            {
              title: 'Asset Locations',
              href: '/payroll/reports/asset-locations',
            },
            { title: 'Asset Reports', href: '/payroll/reports/asset-reports' },
          ],
        },
      ],
    },
    {
      title: 'Banking',
      children: [
        {
          title: 'Add Bank or Credit Card',
          href: '/banking/add-bank-or-credit-card',
        },
        { title: 'Add Bank Rep', href: '/banking/add-bank-rep' },
        {
          title: 'List',
          children: [
            {
              title: 'List of Bank & Cards',
              href: '/banking/list/list-of-bank-and-cards',
            },
            {
              title: 'Bank & Credit Card Categories',
              href: '/banking/list/bank-and-credit-card-categories',
            },
            {
              title: 'Quick Entry Rules',
              href: '/banking/list/quick-entry-rules',
            },
            {
              title: 'Bank Statement Mapping',
              href: '/banking/list/bank-statement-mapping',
            },
          ],
        },
        {
          title: 'Transactions',
          children: [
            { title: 'Banking', href: '/banking/transactions/banking' },
            {
              title: 'Reconcile Banks & Credit Cards',
              href: '/banking/transactions/reconcile-banks-and-credit-cards',
            },
            {
              title: 'Manage Bank Feeds',
              href: '/banking/transactions/manage-bank-feeds',
            },
          ],
        },
        {
          title: 'Reports',
          children: [
            {
              title: 'List of Banks & Credit Cards',
              href: '/banking/reports/list-of-banks-and-credit-cards',
            },
            {
              title: 'Bank and Card Transactions',
              href: '/banking/reports/bank-and-card-transactions',
            },
            {
              title: 'Cash Movements',
              href: '/banking/reports/cash-movements',
            },
            { title: 'Cashflow', href: '/banking/reports/cashflow' },
            {
              title: 'Bank Feeds Audit Trail',
              href: '/banking/reports/bank-feeds-audit-trail',
            },
          ],
        },
        {
          title: 'Special',
          children: [
            {
              title: 'Adjust Bank and Credit Card Opening Balances',
              href: '/banking/special/adjust-bank-and-credit-card-opening-balances',
            },
          ],
        },
      ],
    },
    {
      title: 'Accounts',
      children: [
        { title: 'Add Account', href: '/accounts/add-account' },
        {
          title: 'List',
          children: [
            {
              title: 'List of Accounts',
              href: '/accounts/list/list-of-accounts',
            },
            { title: 'Item Accounts', href: '/accounts/list/item-accounts' },
          ],
        },
        {
          title: 'Account Reporting Groups',
          href: '/accounts/account-reporting-groups',
        },
        {
          title: 'Adjust Opening Hands',
          href: '/accounts/adjust-opening-hands',
        },
        {
          title: 'Reports',
          children: [
            {
              title: 'Account Listing',
              href: '/accounts/reports/account-listing',
            },
            {
              title: 'Account Transactions',
              href: '/accounts/reports/account-transactions',
            },
          ],
        },
      ],
    },

    {
      title: 'Company',
      children: [
        {
          title: 'Change Company Setting',
          children: [
            {
              title: 'Change Password',
              href: '/company/change-company-setting/change-password',
            },
            {
              title: 'My Account',
              href: '/company/change-company-setting/my-account',
            },
            { title: 'Logout', href: '/company/change-company-setting/logout' },
          ],
        },
        {
          title: 'Company Notes and Attachments',
          href: '/company/company-notes-and-attachments',
        },
        {
          title: 'Assets',
          children: [
            { title: 'Add an Asset', href: '/company/assets/add-an-asset' },
            { title: 'List of Assets', href: '/company/assets/list-of-assets' },
            {
              title: 'Asset Categories',
              href: '/company/assets/asset-categories',
            },
            { title: 'Asset Location', href: '/company/assets/asset-location' },
            { title: 'Asset Reports', href: '/company/assets/asset-reports' },
          ],
        },
        {
          title: 'Budgets',
          children: [
            { title: 'Add Budget', href: '/company/budgets/add-budget' },
            {
              title: 'List of Budgets',
              href: '/company/budgets/list-of-budgets',
            },
            {
              title: 'Budgets Reports',
              href: '/company/budgets/budgets-reports',
            },
          ],
        },
        { title: 'Analysis Codes', href: '/company/analysis-codes' },
        { title: 'Import Data', href: '/company/import-data' },
        { title: 'Export Data', href: '/company/export-data' },
        { title: 'Opening Balances', href: '/company/opening-balances' },
      ],
    },
    {
      title: 'Reports',
      children: [
        {
          title: 'Accounting Intelligence Reports',
          href: '/reports/accounting-intelligence-reports',
        },
        { title: 'Customers', href: '/reports/customers' },
        { title: 'Suppliers', href: '/reports/suppliers' },
        { title: 'Items', href: '/reports/items' },
        { title: 'Sales and Purchases', href: '/reports/sales-and-purchases' },
        {
          title: 'Banks & Credit Cards',
          href: '/reports/banks-and-credit-cards',
        },
        { title: 'VAT', href: '/reports/vat' },
        { title: 'Accounts', href: '/reports/accounts' },
        {
          title: 'Financial Statements',
          href: '/reports/financial-statements',
        },
        { title: 'Asset Reports', href: '/reports/asset-reports' },
        { title: 'Budget Reports', href: '/reports/budget-reports' },
        { title: 'Others', href: '/reports/others' },
        { title: 'Accountant Reports', href: '/reports/accountant-reports' },
      ],
    },
  ];

  return (
    <nav className="flex gap-4 items-center p-4 bg-white sticky top-0 left-0 z-30 w-full shadow-sm">
      <div className="font-bold text-xl text-black">
        <img
          src="/images/pottaLogo.svg"
          alt="Potta Logo"
          className="h-8 w-auto"
        />
      </div>

      <ul className="flex space-x-2 flex-1 text-[15px]">
        {menuStructure.map((menu: MenuItem, index: number) => (
          <li
            key={index}
            className="relative cursor-pointer group px-2 py-2 text-black font-medium text-[15px]"
            onMouseEnter={() => setActiveMenu(index as any)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            {menu.children ? (
              menu.title
            ) : menu.href ? (
              <Link href={menu.href} className="w-full h-full block">
                {menu.title}
              </Link>
            ) : (
              menu.title
            )}
            {Array.isArray(menu.children) && menu.children.length > 0 && (
              <ChevronDown className="h-4 w-4 ml-2 font-medium inline align-middle" />
            )}

            {Array.isArray(menu.children) && menu.children.length > 0 && (
              <div
                className={`absolute left-0 top-[58px] z-50 
                bg-white min-w-56
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-300 ease-in-out
                transform origin-top scale-y-0 group-hover:scale-y-100
                border border-gray-200
                ${
                  activeMenu === index ? 'opacity-100 visible scale-y-100' : ''
                }`}
              >
                {menu.children.map((child: MenuItem, childIndex: number) => (
                  <div key={childIndex} className="relative group/child">
                    <div className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-black cursor-pointer">
                      <span className="flex justify-between w-full whitespace-nowrap items-center text-[14px]">
                        {child.children ? (
                          child.title
                        ) : child.href ? (
                          <Link
                            href={child.href}
                            className="w-full h-full block"
                          >
                            {child.title}
                          </Link>
                        ) : (
                          child.title
                        )}
                        {child.children && (
                          <ChevronRight className="h-4 w-4 ml-2 inline align-middle" />
                        )}
                      </span>
                    </div>
                    {child.children && (
                      <div
                        className="
                          absolute left-full top-0 
                          bg-white min-w-56
                          opacity-0 invisible
                          group-hover/child:opacity-100 group-hover/child:visible
                          transition-all duration-300 ease-in-out
                          transform origin-top scale-y-0 group-hover/child:scale-y-100
                          border border-gray-200
                        "
                      >
                        {(() => {
                          const hasGreatGrandchildren = child.children.some(
                            (gc) => gc.children && gc.children.length > 0
                          );
                          if (hasGreatGrandchildren) {
                            // No scroll wrapper if any grandchild has children
                            return child.children.map(
                              (
                                grandchild: MenuItem,
                                grandchildIndex: number
                              ) => (
                                <div
                                  key={grandchildIndex}
                                  className="relative group/grandchild"
                                >
                                  <div className="px-4 py-2 whitespace-nowrap hover:bg-gray-100 flex justify-between items-center text-black cursor-pointer">
                                    <span className="flex justify-between w-full items-center text-[15px]">
                                      {grandchild.children ? (
                                        grandchild.title
                                      ) : grandchild.href ? (
                                        <Link
                                          href={grandchild.href}
                                          className="w-full h-full block"
                                        >
                                          {grandchild.title}
                                        </Link>
                                      ) : (
                                        grandchild.title
                                      )}
                                      {grandchild.children && (
                                        <ChevronRight className="h-4 w-4 ml-2 inline align-middle" />
                                      )}
                                    </span>
                                  </div>
                                  {grandchild.children && (
                                    <div
                                      className="
                                      absolute left-full top-0 
                                      bg-white min-w-56 max-h-[70vh] overflow-y-auto
                                      opacity-0 invisible
                                      group-hover/grandchild:opacity-100 group-hover/grandchild:visible
                                      transition-all duration-300 ease-in-out
                                      transform origin-top scale-y-0 group-hover/grandchild:scale-y-100
                                      border border-gray-200
                                    "
                                    >
                                      {grandchild.children.map(
                                        (
                                          greatGrandchild: MenuItem,
                                          greatGrandchildIndex: number
                                        ) => (
                                          <div
                                            key={greatGrandchildIndex}
                                            className="px-4 py-2 whitespace-nowrap hover:bg-gray-100 flex justify-between items-center text-black cursor-pointer"
                                          >
                                            <span className="flex justify-between w-full items-center text-[14px]">
                                              {greatGrandchild.children ? (
                                                greatGrandchild.title
                                              ) : greatGrandchild.href ? (
                                                <Link
                                                  href={greatGrandchild.href}
                                                  className="w-full h-full block"
                                                >
                                                  {greatGrandchild.title}
                                                </Link>
                                              ) : (
                                                greatGrandchild.title
                                              )}
                                              {greatGrandchild.children && (
                                                <ChevronRight className="h-4 w-4 ml-2 inline align-middle" />
                                              )}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            );
                          } else {
                            // Scroll wrapper for normal grandchildren
                            return (
                              <div className="max-h-[70vh] overflow-y-auto">
                                {child.children.map(
                                  (
                                    grandchild: MenuItem,
                                    grandchildIndex: number
                                  ) => (
                                    <div
                                      key={grandchildIndex}
                                      className="relative group/grandchild"
                                    >
                                      <div className="px-4 py-2 whitespace-nowrap hover:bg-gray-100 flex justify-between items-center text-black cursor-pointer">
                                        <span className="flex justify-between w-full items-center text-[14px]">
                                          {grandchild.children ? (
                                            grandchild.title
                                          ) : grandchild.href ? (
                                            <Link
                                              href={grandchild.href}
                                              className="w-full h-full block"
                                            >
                                              {grandchild.title}
                                            </Link>
                                          ) : (
                                            grandchild.title
                                          )}
                                          {grandchild.children && (
                                            <ChevronRight className="h-4 w-4 ml-2 inline align-middle" />
                                          )}
                                        </span>
                                      </div>
                                      {grandchild.children && (
                                        <div
                                          className="
                                          absolute left-full top-0 
                                          bg-white min-w-56 max-h-[70vh] overflow-y-auto
                                          opacity-0 invisible
                                          group-hover/grandchild:opacity-100 group-hover/grandchild:visible
                                          transition-all duration-300 ease-in-out
                                          transform origin-top scale-y-0 group-hover/grandchild:scale-y-100
                                          border border-gray-200
                                        "
                                        >
                                          {grandchild.children.map(
                                            (
                                              greatGrandchild: MenuItem,
                                              greatGrandchildIndex: number
                                            ) => (
                                              <div
                                                key={greatGrandchildIndex}
                                                className="px-4 py-2 whitespace-nowrap hover:bg-gray-100 flex justify-between items-center text-black cursor-pointer"
                                              >
                                                <span className="flex justify-between w-full items-center text-[14px]">
                                                  {greatGrandchild.children ? (
                                                    greatGrandchild.title
                                                  ) : greatGrandchild.href ? (
                                                    <Link
                                                      href={
                                                        greatGrandchild.href
                                                      }
                                                      className="w-full h-full block"
                                                    >
                                                      {greatGrandchild.title}
                                                    </Link>
                                                  ) : (
                                                    greatGrandchild.title
                                                  )}
                                                  {greatGrandchild.children && (
                                                    <ChevronRight className="h-4 w-4 ml-2 inline align-middle" />
                                                  )}
                                                </span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            );
                          }
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4 ml-auto">
        <button className="p-2 rounded-full transition-colors">
          <Inbox size={20} className="text-gray-600 hover:text-gray-800" />
        </button>
        <button className="p-2 rounded-full transition-colors">
          <Bell size={20} className="text-gray-600 hover:text-gray-800" />
        </button>
      </div>
    </nav>
  );
};

export default CustomNavbar;

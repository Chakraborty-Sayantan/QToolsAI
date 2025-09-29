"use client"

import React from 'react';
import { useHistoryStore } from '@/store/history-store';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { sidebarItems } from '@/lib/sidebar-data';

// Helper to flatten sidebar items for easy icon lookup
const allTools = sidebarItems.flatMap(item => 
  item.items ? item.items.map(subItem => ({ ...subItem, href: subItem.href })) : []
);

const HistoryPage = () => {
  const { history, clearHistory } = useHistoryStore();

  const getToolIcon = (href: string) => {
    const tool = allTools.find((t) => t.href === href);
    const Icon = tool?.icon;
    return Icon ? <Icon className="w-6 h-6 text-primary" /> : null;
  };

  // FIX: Helper function to correctly format strings or objects
  const formatDisplayData = (data: any) => {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <DashboardShell>
      <div className="flex-1">
        <DashboardHeader heading="Global History" text="Review your past activity across all tools." >
            {history.length > 0 && (
                <Button variant="destructive" onClick={() => { if (confirm('Are you sure you want to clear all history?')) clearHistory(); }}>
                    Clear History
                </Button>
            )}
        </DashboardHeader>
        <div className="p-4 md:p-8">
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground mt-8">
              <p>You have no history yet.</p>
              <p>Your activity from various tools will be saved here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <Card key={item.id}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-x-4">
                                {getToolIcon(item.href)}
                                <CardTitle>{item.tool}</CardTitle>
                            </div>
                            <Link href={item.href}>
                                <Button variant="outline" size="sm">
                                    Go to Tool
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                        <div>
                            <h3 className="font-semibold text-sm mb-1">INPUT:</h3>
                            {/* FIX: Added classes for text wrapping */}
                            <pre className="mt-1 rounded-md bg-slate-900 dark:bg-slate-800 p-4 overflow-x-auto whitespace-pre-wrap break-words">
                                <code className="text-white text-sm">{formatDisplayData(item.input)}</code>
                            </pre>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm mb-1">OUTPUT:</h3>
                            {/* FIX: Added classes for text wrapping */}
                            <pre className="mt-1 rounded-md bg-slate-900 dark:bg-slate-800 p-4 overflow-x-auto whitespace-pre-wrap break-words">
                                <code className="text-white text-sm">{formatDisplayData(item.output)}</code>
                            </pre>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2">
                            {new Date(item.timestamp).toLocaleString()}
                        </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default HistoryPage;
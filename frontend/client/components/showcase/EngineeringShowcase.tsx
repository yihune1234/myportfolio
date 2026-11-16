import React from 'react';
import { motion } from 'framer-motion';
import { useGitHubPulse } from '@/hooks/useGitHubPulse';
import { useGitHubSettings } from '@/hooks/useGitHubSettings';
import { PulseHeader } from './PulseHeader';
import { CodebaseDNA } from './CodebaseDNA';
import { ContributionVelocity } from './ContributionVelocity';
import { OrganizationImpact } from './OrganizationImpact';
import { LiveActivityTicker } from './LiveActivityTicker';
import { RepositoryExplorer } from './RepositoryExplorer';

export default function EngineeringShowcase() {
  const { data: settings } = useGitHubSettings();
  const {
    scope,
    setScope,
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    sortBy,
    setSortBy,
    allRepos,
    activity,
    languages,
    health,
    orgProfile,
    orgRepos,
    orgActivity,
    lastSync,
    isLoading,
    isRefreshing,
    refetchAll,
  } = useGitHubPulse('ALL');

  if (settings && settings.showEngineeringShowcase === false) {
    return null;
  }

  return (
    <section
      id="engineering"
      className="section-padding relative overflow-hidden bg-background border-t border-white/[0.08]"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-[#FF8A00] opacity-[0.03] rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-[#0A1330] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 architecture-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header & Dual Identity Switcher */}
        <PulseHeader
          scope={scope}
          onScopeChange={setScope}
          health={health}
          lastSync={lastSync}
          onRefresh={refetchAll}
          isRefreshing={isRefreshing}
        />

        {/* Bento Grid: Telemetry, DNA, Velocity & Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Left Column: Codebase DNA (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <CodebaseDNA
              data={languages}
              isLoading={isLoading}
              scope={scope}
            />
          </div>

          {/* Right Column: Contribution Velocity (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <ContributionVelocity
              events={activity}
              isLoading={isLoading}
              scope={scope}
            />
          </div>

          {/* Organization Impact (5 cols if Org or All) */}
          {scope !== 'PERSONAL' && (
            <div className="lg:col-span-5 flex flex-col">
              <OrganizationImpact
                orgProfile={orgProfile}
                orgRepos={orgRepos}
                orgActivity={orgActivity}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Live Activity Terminal Feed (7 cols or 12 cols if Personal) */}
          <div className={scope === 'PERSONAL' ? 'lg:col-span-12 flex flex-col' : 'lg:col-span-7 flex flex-col'}>
            <LiveActivityTicker
              events={activity}
              isLoading={isLoading}
              scope={scope}
            />
          </div>
        </div>

        {/* Interactive Repository Explorer */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#F5F7FA] tracking-tight">
                Repository Explorer
              </h3>
              <p className="text-xs sm:text-sm text-[#B7C0D1] mt-0.5">
                Explore {allRepos.length} public code repositories across personal research and organization platforms
              </p>
            </div>
          </div>

          <RepositoryExplorer
            repos={allRepos}
            isLoading={isLoading}
            scope={scope}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>
    </section>
  );
}

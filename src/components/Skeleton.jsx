import React from 'react';

/**
 * Shimmer base class
 */
const Shimmer = () => (
  <style>{`
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .skeleton-shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  `}</style>
);

/**
 * Generic Shimmer block
 */
export const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded ${className}`} />
);

/**
 * Dashboard Skeleton Loader
 */
export const DashboardSkeleton = () => {
  return (
    <div className="space-y-12 w-full animate-fade-in">
      <Shimmer />
      {/* Title block */}
      <div className="space-y-3">
        <SkeletonBlock className="h-10 w-48" />
        <SkeletonBlock className="h-4 w-72" />
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#111118]/60 border border-white/[0.04] p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-6 w-6 rounded-full" />
            </div>
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Urgent Section */}
      <div className="bg-[#111118]/60 border border-white/[0.04] p-8 rounded-2xl space-y-4">
        <SkeletonBlock className="h-4 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 bg-[#0D0D14]/40 border border-white/5 rounded-xl space-y-3">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-[#111118]/60 border border-white/[0.04] p-8 rounded-2xl space-y-6">
          <SkeletonBlock className="h-5 w-36" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-6 bg-[#0D0D14]/30 border border-white/5 rounded-xl space-y-3">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-3 w-40" />
                <SkeletonBlock className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[#111118]/60 border border-white/[0.04] p-8 rounded-2xl space-y-6">
          <SkeletonBlock className="h-5 w-28" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock className="h-4 w-4 rounded" />
                <SkeletonBlock className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Workspaces Page Skeleton Loader
 */
export const WorkspacesSkeleton = () => {
  return (
    <div className="space-y-10 w-full animate-fade-in">
      <Shimmer />
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-44" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-10 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-[#111118]/60 border border-white/[0.04] p-6 rounded-2xl space-y-4 h-48 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <SkeletonBlock className="h-8 w-8 rounded-lg" />
              <SkeletonBlock className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-3 w-full" />
            </div>
            <div className="space-y-2 pt-2">
              <SkeletonBlock className="h-2 w-full" />
              <div className="flex justify-between">
                <SkeletonBlock className="h-3 w-10" />
                <SkeletonBlock className="h-3 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * WorkspaceDetail Page Skeleton Loader
 */
export const WorkspaceDetailSkeleton = () => {
  return (
    <div className="space-y-8 w-full animate-fade-in">
      <Shimmer />
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-20" />
        <div className="flex justify-between items-center">
          <SkeletonBlock className="h-9 w-56" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-8 w-8 rounded" />
            <SkeletonBlock className="h-8 w-24 rounded" />
          </div>
        </div>
        <SkeletonBlock className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Roadmap skeleton */}
        <div className="col-span-12 lg:col-span-7 bg-[#111118]/60 border border-white/[0.04] p-8 rounded-2xl space-y-6">
          <SkeletonBlock className="h-5 w-32" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-[#0D0D14]/30 border border-white/5 rounded-xl space-y-3">
                <SkeletonBlock className="h-4 w-28" />
                <div className="space-y-2 pl-4">
                  <SkeletonBlock className="h-3 w-full" />
                  <SkeletonBlock className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks skeleton */}
        <div className="col-span-12 lg:col-span-5 bg-[#111118]/60 border border-white/[0.04] p-8 rounded-2xl space-y-6">
          <SkeletonBlock className="h-5 w-24" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[#0D0D14]/20 border border-white/5 rounded-xl">
                <SkeletonBlock className="h-4 w-4 rounded" />
                <SkeletonBlock className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Profile Page Skeleton Loader
 */
export const ProfileSkeleton = () => {
  return (
    <div className="space-y-8 w-full animate-fade-in">
      <Shimmer />
      <div className="bg-[#111118]/60 border border-white/[0.04] p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6">
        <SkeletonBlock className="h-24 w-24 rounded-full" />
        <div className="space-y-3 flex-grow text-center md:text-left">
          <SkeletonBlock className="h-8 w-44 mx-auto md:mx-0" />
          <SkeletonBlock className="h-4 w-28 mx-auto md:mx-0" />
          <SkeletonBlock className="h-3 w-96 mx-auto md:mx-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#111118]/60 border border-white/[0.04] p-6 rounded-2xl space-y-3">
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
};

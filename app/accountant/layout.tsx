import React from 'react';

import SidebarANDRestContainer from '@/components/ui/SidebarAndRestContainer';

const layout = async ({ children }: { children: React.ReactNode }) => {
  return <SidebarANDRestContainer>{children}</SidebarANDRestContainer>;
};

export default layout;

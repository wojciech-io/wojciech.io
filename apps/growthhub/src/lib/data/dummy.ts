// Dummy data wrapper — returns DashboardData shape, used when D1 is empty
// or as the source for the public /demo route.

import type { DashboardData } from '../types';
import {
  headlineMetrics, acquisitionLast14, sourceBreakdown,
  pipeline, topLeads,
} from '../../lib/dummy-data';

export function readDashboardDummy(): DashboardData {
  return {
    headline: headlineMetrics,
    acquisition: acquisitionLast14,
    sources: sourceBreakdown,
    pipeline,
    topLeads,
    source: 'dummy',
  };
}

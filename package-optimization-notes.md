# Package Optimization Analysis

## Duplicate/Unused Dependencies to Remove:

1. **Date Pickers** - Using Ant Design's DatePicker, can remove:
   - `react-date-range` (not used)
   - `react-datepicker` (only used in one component, can replace with antd)

2. **Icon Libraries** - Multiple icon libraries:
   - `react-feather` (minimal usage)
   - `react-icons` (extensive usage) ✅ Keep
   - Consider consolidating to one

3. **Potential Heavy Dependencies to Lazy Load**:
   - `@monaco-editor/react` ✅ Already lazy loaded
   - `@tinymce/tinymce-react` ✅ Already lazy loaded
   - `recharts` - Charts (should lazy load)
   - `react-qr-code` - QR generation (should lazy load)

## Bundle Size Impact:
- `react-date-range`: ~200KB
- `react-datepicker`: ~150KB
- `react-feather`: ~50KB
- Total potential savings: ~400KB gzipped

## Recommended Actions:
1. Remove unused date pickers
2. Lazy load chart components
3. Consider tree-shaking unused lodash functions
4. Audit @sentry bundle size
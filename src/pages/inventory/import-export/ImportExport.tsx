/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { Default } from '$app/components/layouts/Default';
import { Card, Element } from '$app/components/cards';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { Button, InputField, SelectField } from '$app/components/forms';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import { Icon } from '$app/components/icons/Icon';
import {
  MdDownload,
  MdUpload,
  MdDescription,
  MdWarning,
  MdCheckCircle,
  MdError,
} from 'react-icons/md';
import Toggle from '$app/components/forms/Toggle';

export default function ImportExport() {
  useTitle('inventory_import_export');

  const [t] = useTranslation();
  const company = useCurrentCompany();

  const [exportParams, setExportParams] = useState({
    format: 'csv',
    include_movements: false,
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const [importData, setImportData] = useState({
    csv_content: '',
    update_existing: false,
  });

  const [importResults, setImportResults] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const pages: Page[] = [
    { name: t('inventory'), href: '/inventory' },
    { name: t('import_export'), href: '/inventory/import-export' },
  ];

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportInventory = async () => {
    setIsExporting(true);
    try {
      const response = await request(
        'GET',
        endpoint('/api/v1/inventory/export/inventory'),
        exportParams
      );
      const { csv_content, filename } = response.data.data;
      downloadFile(csv_content, filename);
      toast.success('Inventory exported successfully');
    } catch (error) {
      toast.error('Export failed');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMovements = async () => {
    setIsExporting(true);
    try {
      const response = await request(
        'GET',
        endpoint('/api/v1/inventory/export/movements'),
        {
          from: exportParams.from,
          to: exportParams.to,
        }
      );
      const { csv_content, filename } = response.data.data;
      downloadFile(csv_content, filename);
      toast.success('Stock movements exported successfully');
    } catch (error) {
      toast.error('Export failed');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = async (type: 'inventory' | 'movements') => {
    try {
      const response = await request(
        'GET',
        endpoint('/api/v1/inventory/import/template'),
        { type }
      );
      const { csv_content, filename } = response.data.data;
      downloadFile(csv_content, filename);
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Template download failed');
      console.error(error);
    }
  };

  const handleImport = async () => {
    if (!importData.csv_content.trim()) {
      toast.error('Please provide CSV content to import');
      return;
    }

    setIsImporting(true);
    setImportResults(null);

    try {
      const response = await request(
        'POST',
        endpoint('/api/v1/inventory/import/inventory'),
        importData
      );
      setImportResults(response.data.data);

      if (response.data.data.imported_count > 0) {
        toast.success(
          `Successfully imported ${response.data.data.imported_count} records`
        );
      } else {
        toast.warning('No records were imported');
      }
    } catch (error: any) {
      const errorData = error.response?.data?.data;
      setImportResults(
        errorData || {
          errors: ['Import failed'],
          warnings: [],
          imported_count: 0,
        }
      );
      toast.error('Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData((prev) => ({ ...prev, csv_content: content }));
      };
      reader.readAsText(file);
    }
  };

  if (!company?.track_inventory) {
    return (
      <Default title={t('inventory_import_export')} breadcrumbs={pages}>
        <Card withContainer>
          <Element>
            <div className="text-center py-8">
              <div className="text-gray-500 font-medium">
                {t('inventory_tracking_disabled')}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {t('enable_inventory_tracking_to_use_import_export')}
              </div>
            </div>
          </Element>
        </Card>
      </Default>
    );
  }

  return (
    <Default title={t('inventory_import_export')} breadcrumbs={pages}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Section */}
        <Card title={t('export_inventory_data')} withContainer>
          <div className="space-y-4">
            <Element leftSide={t('export_format')}>
              <SelectField
                value={exportParams.format}
                onValueChange={(value) =>
                  setExportParams((prev) => ({ ...prev, format: value }))
                }
              >
                <option value="csv">CSV</option>
              </SelectField>
            </Element>

            <Element leftSide={t('include_movements')}>
              <Toggle
                checked={exportParams.include_movements}
                onValueChange={(value) =>
                  setExportParams((prev) => ({
                    ...prev,
                    include_movements: value,
                  }))
                }
              />
            </Element>

            <div className="grid grid-cols-2 gap-4">
              <Element leftSide={t('from_date')}>
                <InputField
                  type="date"
                  value={exportParams.from}
                  onValueChange={(value) =>
                    setExportParams((prev) => ({ ...prev, from: value }))
                  }
                />
              </Element>
              <Element leftSide={t('to_date')}>
                <InputField
                  type="date"
                  value={exportParams.to}
                  onValueChange={(value) =>
                    setExportParams((prev) => ({ ...prev, to: value }))
                  }
                />
              </Element>
            </div>

            <div className="space-y-2 pt-4">
              <Button
                type="primary"
                onClick={handleExportInventory}
                disabled={isExporting}
                className="w-full"
              >
                <Icon element={MdDownload} className="w-4 h-4 mr-2" />
                {isExporting ? t('exporting') : t('export_current_inventory')}
              </Button>

              <Button
                type="secondary"
                onClick={handleExportMovements}
                disabled={isExporting}
                className="w-full"
              >
                <Icon element={MdDownload} className="w-4 h-4 mr-2" />
                {isExporting ? t('exporting') : t('export_stock_movements')}
              </Button>
            </div>
          </div>
        </Card>

        {/* Import Section */}
        <Card title={t('import_inventory_data')} withContainer>
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon
                  element={MdDescription}
                  className="w-5 h-5 text-blue-600 mt-0.5"
                />
                <div className="text-sm">
                  <div className="font-medium text-blue-800">
                    {t('import_instructions')}
                  </div>
                  <div className="text-blue-600 mt-1">
                    1. Download the template file below
                    <br />
                    2. Fill in your inventory data
                    <br />
                    3. Upload the completed CSV file
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="secondary"
                onClick={() => handleDownloadTemplate('inventory')}
                size="sm"
              >
                <Icon element={MdDescription} className="w-4 h-4 mr-1" />
                {t('inventory_template')}
              </Button>
              <Button
                type="secondary"
                onClick={() => handleDownloadTemplate('movements')}
                size="sm"
              >
                <Icon element={MdDescription} className="w-4 h-4 mr-1" />
                {t('movements_template')}
              </Button>
            </div>

            <Element leftSide={t('csv_file')}>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </Element>

            <Element leftSide={t('csv_content')}>
              <InputField
                element="textarea"
                value={importData.csv_content}
                onValueChange={(value) =>
                  setImportData((prev) => ({ ...prev, csv_content: value }))
                }
                placeholder="Paste CSV content here or upload a file above"
                className="h-24"
              />
            </Element>

            <Element leftSide={t('update_existing_records')}>
              <Toggle
                checked={importData.update_existing}
                onValueChange={(value) =>
                  setImportData((prev) => ({ ...prev, update_existing: value }))
                }
              />
            </Element>

            <Button
              type="primary"
              onClick={handleImport}
              disabled={isImporting || !importData.csv_content.trim()}
              className="w-full"
            >
              <Icon element={MdUpload} className="w-4 h-4 mr-2" />
              {isImporting ? t('importing') : t('import_inventory')}
            </Button>
          </div>
        </Card>
      </div>

      {/* Import Results */}
      {importResults && (
        <Card title={t('import_results')} withContainer className="mt-6">
          <Element>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Icon
                    element={MdCheckCircle}
                    className="w-6 h-6 text-green-600 mx-auto mb-1"
                  />
                  <div className="text-2xl font-bold text-green-600">
                    {importResults.imported_count}
                  </div>
                  <div className="text-sm text-green-700">{t('imported')}</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <Icon
                    element={MdError}
                    className="w-6 h-6 text-red-600 mx-auto mb-1"
                  />
                  <div className="text-2xl font-bold text-red-600">
                    {importResults.errors?.length || 0}
                  </div>
                  <div className="text-sm text-red-700">{t('errors')}</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <Icon
                    element={MdWarning}
                    className="w-6 h-6 text-yellow-600 mx-auto mb-1"
                  />
                  <div className="text-2xl font-bold text-yellow-600">
                    {importResults.warnings?.length || 0}
                  </div>
                  <div className="text-sm text-yellow-700">{t('warnings')}</div>
                </div>
              </div>

              {/* Errors */}
              {importResults.errors && importResults.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-800 mb-2">
                    {t('errors')}
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <ul className="text-sm text-red-700 space-y-1">
                      {importResults.errors.map(
                        (error: string, index: number) => (
                          <li key={index}>• {error}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {importResults.warnings && importResults.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">
                    {t('warnings')}
                  </h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {importResults.warnings.map(
                        (warning: string, index: number) => (
                          <li key={index}>• {warning}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </Element>
        </Card>
      )}
    </Default>
  );
}

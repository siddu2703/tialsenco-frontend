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
import { useQuery } from 'react-query';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { SelectField } from '$app/components/forms';
import { Spinner } from '$app/components/Spinner';
import { Icon } from '$app/components/icons/Icon';
import {
  MdTrendingUp,
  MdTrendingDown,
  MdTrendingFlat,
  MdPsychology,
  MdWarning,
} from 'react-icons/md';
import { useProductsQuery } from '$app/common/queries/products';

export default function Forecast() {
  useTitle('ai_demand_forecasting');

  const [t] = useTranslation();
  const company = useCurrentCompany();

  const [forecastParams, setForecastParams] = useState({
    product_id: '',
    forecast_days: 30,
    historical_days: 90,
  });

  const pages: Page[] = [
    { name: t('inventory'), href: '/inventory' },
    { name: t('ai_demand_forecasting'), href: '/inventory/forecast' },
  ];

  const { data: productsData } = useProductsQuery();
  const products = productsData?.data?.data || [];

  const { data: forecastData, isLoading: forecastLoading } = useQuery(
    ['/api/v1/inventory/forecast', forecastParams],
    () =>
      request('GET', endpoint('/api/v1/inventory/forecast'), forecastParams),
    { enabled: Boolean(company?.track_inventory) }
  );

  const { data: seasonalData, isLoading: seasonalLoading } = useQuery(
    '/api/v1/inventory/forecast/seasonal',
    () => request('GET', endpoint('/api/v1/inventory/forecast/seasonal')),
    { enabled: Boolean(company?.track_inventory) }
  );

  const { data: productInsights, isLoading: insightsLoading } = useQuery(
    ['/api/v1/inventory/forecast/product', forecastParams.product_id],
    () =>
      request('GET', endpoint('/api/v1/inventory/forecast/product'), {
        product_id: forecastParams.product_id,
      }),
    { enabled: Boolean(company?.track_inventory && forecastParams.product_id) }
  );

  const forecasts = forecastData?.data?.data?.forecasts || [];
  const metadata = forecastData?.data?.data?.metadata || {};
  const seasonal = seasonalData?.data?.data || {};
  const insights = productInsights?.data?.data || {};

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'increasing':
        return (
          <Icon element={MdTrendingUp} className="w-5 h-5 text-green-600" />
        );
      case 'decreasing':
        return (
          <Icon element={MdTrendingDown} className="w-5 h-5 text-red-600" />
        );
      default:
        return (
          <Icon element={MdTrendingFlat} className="w-5 h-5 text-gray-600" />
        );
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (!company?.track_inventory) {
    return (
      <Default title={t('ai_demand_forecasting')} breadcrumbs={pages}>
        <Card withContainer>
          <Element>
            <div className="text-center py-8">
              <div className="text-gray-500 font-medium">
                {t('inventory_tracking_disabled')}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {t('enable_inventory_tracking_to_use_ai_forecasting')}
              </div>
            </div>
          </Element>
        </Card>
      </Default>
    );
  }

  return (
    <Default title={t('ai_demand_forecasting')} breadcrumbs={pages}>
      {/* Forecast Parameters */}
      <Card title={t('forecast_parameters')} withContainer className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Element leftSide={t('specific_product')}>
            <SelectField
              value={forecastParams.product_id}
              onValueChange={(value) =>
                setForecastParams((prev) => ({ ...prev, product_id: value }))
              }
            >
              <option value="">{t('all_products')}</option>
              {products.map((product: any) => (
                <option key={product.id} value={product.id}>
                  {product.product_key} - {product.notes}
                </option>
              ))}
            </SelectField>
          </Element>

          <Element leftSide={t('forecast_period_days')}>
            <SelectField
              value={forecastParams.forecast_days.toString()}
              onValueChange={(value) =>
                setForecastParams((prev) => ({
                  ...prev,
                  forecast_days: parseInt(value),
                }))
              }
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
            </SelectField>
          </Element>

          <Element leftSide={t('historical_period_days')}>
            <SelectField
              value={forecastParams.historical_days.toString()}
              onValueChange={(value) =>
                setForecastParams((prev) => ({
                  ...prev,
                  historical_days: parseInt(value),
                }))
              }
            >
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
              <option value="180">180 Days</option>
              <option value="365">365 Days</option>
            </SelectField>
          </Element>
        </div>
      </Card>

      {/* AI Forecast Accuracy */}
      {metadata && (
        <Card title={t('forecast_metadata')} withContainer className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon
                  element={MdPsychology}
                  className="w-6 h-6 text-purple-600"
                />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {metadata.forecast_accuracy || 0}%
              </div>
              <div className="text-sm text-gray-500">{t('ai_accuracy')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metadata.data_points || 0}
              </div>
              <div className="text-sm text-gray-500">{t('data_points')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metadata.forecast_period_days || 0}
              </div>
              <div className="text-sm text-gray-500">{t('forecast_days')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {metadata.historical_period_days || 0}
              </div>
              <div className="text-sm text-gray-500">
                {t('historical_days')}
              </div>
            </div>
          </div>
        </Card>
      )}

      {forecastLoading || seasonalLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Demand Forecasts */}
          <Card title={t('ai_demand_forecasts')} withContainer>
            <Element>
              {forecasts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 font-medium">
                    {t('no_forecast_data')}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {t('need_more_historical_data')}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {forecasts
                    .slice(0, 10)
                    .map((forecast: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">
                              {forecast.product?.product_key}
                            </div>
                            <div className="text-sm text-gray-600">
                              {[
                                forecast.product?.tile_type,
                                forecast.product?.tile_size,
                                forecast.product?.tile_color,
                              ]
                                .filter(Boolean)
                                .join(' • ')}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {forecast.recommendation}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold">
                              {forecast.forecasted_demand}
                            </div>
                            <div className="text-sm text-gray-500">
                              {forecast.daily_average}/day
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(
                                forecast.confidence_score
                              )}`}
                            >
                              {forecast.confidence_score}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Element>
          </Card>

          {/* Seasonal Patterns */}
          <Card title={t('seasonal_insights')} withContainer>
            <Element>
              <div className="space-y-4">
                {seasonal.peak_months && seasonal.peak_months.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {t('peak_demand_months')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {seasonal.peak_months.map((month: number) => (
                        <span
                          key={month}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {new Date(0, month - 1).toLocaleString('default', {
                            month: 'long',
                          })}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {seasonal.seasonal_recommendations &&
                  seasonal.seasonal_recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">
                        {t('seasonal_recommendations')}
                      </h4>
                      <div className="space-y-2">
                        {seasonal.seasonal_recommendations.map(
                          (rec: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-start space-x-2 p-2 bg-yellow-50 rounded"
                            >
                              <Icon
                                element={MdWarning}
                                className="w-4 h-4 text-yellow-600 mt-0.5"
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  {rec.tile_type}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {rec.recommendation}
                                </div>
                                <div className="text-xs text-green-600">
                                  +{rec.expected_increase}% increase expected
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </Element>
          </Card>
        </div>
      )}

      {/* Product-Specific Insights */}
      {forecastParams.product_id && insights.product && (
        <Card
          title={`${t('detailed_insights')}: ${insights.product.product_key}`}
          withContainer
          className="mt-6"
        >
          <Element>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">{t('demand_metrics')}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{t('avg_daily_demand')}</span>
                    <span className="font-bold">
                      {insights.demand_metrics?.avg_daily_demand}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{t('demand_variability')}</span>
                    <span className="font-bold">
                      {insights.demand_metrics?.demand_variability}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{t('trend_direction')}</span>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(insights.demand_metrics?.trend_direction)}
                      <span className="font-bold">
                        {insights.demand_metrics?.trend_direction}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{t('30_day_forecast')}</span>
                    <span className="font-bold text-green-600">
                      {insights.forecast_30_days}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">{t('ai_recommendations')}</h4>
                <div className="space-y-2">
                  {insights.recommendations?.map(
                    (rec: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 p-2 bg-blue-50 rounded"
                      >
                        <Icon
                          element={MdPsychology}
                          className="w-4 h-4 text-blue-600 mt-0.5"
                        />
                        <span className="text-sm">{rec}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </Element>
        </Card>
      )}
    </Default>
  );
}

/**
 * Hard-coded example data for the AI Insights tab.
 * Used as illustrative placeholders for sections that have no real data yet,
 * so the UI demonstrates what each insight looks like once a simulation runs.
 * Every item carries an `id`/marker so the page can tag it as an "Example".
 */
import type {
  AnomalyRecord,
  DeviceForecast,
  DeviceEfficiency,
  EfficiencySummary,
  LoadShiftOpportunity,
  RenewableStats,
} from '@/types/insights'

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

// ── Anomaly Detection ──────────────────────────────────────────────────────
export const EXAMPLE_ANOMALIES: AnomalyRecord[] = [
  {
    id: 'example-anomaly-1',
    device_id: 'example-hvac',
    device_name: 'HVAC Unit (Living Room)',
    device_type: 'hvac',
    anomaly_type: 'spike',
    expected_value: 2.1,
    actual_value: 5.8,
    z_score: 4.3,
    detected_at: minutesAgo(18),
  },
  {
    id: 'example-anomaly-2',
    device_id: 'example-fridge',
    device_name: 'Refrigerator',
    device_type: 'appliance',
    anomaly_type: 'drift',
    expected_value: 0.15,
    actual_value: 0.34,
    z_score: 2.6,
    detected_at: minutesAgo(95),
  },
  {
    id: 'example-anomaly-3',
    device_id: 'example-ev',
    device_name: 'EV Charger',
    device_type: 'ev_charger',
    anomaly_type: 'dropout',
    expected_value: 7.2,
    actual_value: 0.0,
    z_score: -3.1,
    detected_at: minutesAgo(220),
  },
]

// ── Load Shifting ──────────────────────────────────────────────────────────
export const EXAMPLE_LOAD_SHIFT: LoadShiftOpportunity[] = [
  {
    device_id: 'example-ev',
    device_name: 'EV Charger',
    title: 'Shift EV charging to off-peak hours',
    description:
      'Charging your EV between 23:00 and 06:00 avoids peak tariffs. Schedule charging overnight to cut cost without changing your routine.',
    estimated_saving_kwh: 28.0,
    estimated_saving_cost: 3.36,
    confidence_score: 0.88,
    action_detail: {
      recommended_start_hour: 23,
      recommended_end_hour: 6,
      current_rate: 0.2,
      off_peak_rate: 0.08,
    },
  },
  {
    device_id: 'example-dishwasher',
    device_name: 'Dishwasher',
    title: 'Delay dishwasher to the off-peak window',
    description:
      'Running the dishwasher after 22:00 uses the lower off-peak rate. Use the delay-start timer to move the cycle out of peak hours.',
    estimated_saving_kwh: 1.4,
    estimated_saving_cost: 0.17,
    confidence_score: 0.74,
    action_detail: {
      recommended_start_hour: 22,
      recommended_end_hour: 5,
      current_rate: 0.2,
      off_peak_rate: 0.08,
    },
  },
]

// ── Renewable ──────────────────────────────────────────────────────────────
export const EXAMPLE_RENEWABLE: RenewableStats = {
  fraction: 0.42,
  total_production_kwh: 18.6,
  total_consumption_kwh: 44.3,
  net_kwh: -25.7,
  self_sufficiency: 0.42,
  producing_devices: 1,
}

// ── Efficiency ─────────────────────────────────────────────────────────────
const EXAMPLE_EFFICIENCY_DEVICES: DeviceEfficiency[] = [
  {
    device_id: 'example-solar',
    device_name: 'Rooftop Solar Array',
    device_type: 'solar_panel',
    efficiency_score: 88,
    label: 'efficient',
    confidence: 0.91,
    readings_count: 142,
  },
  {
    device_id: 'example-hvac',
    device_name: 'HVAC Unit (Living Room)',
    device_type: 'hvac',
    efficiency_score: 54,
    label: 'moderate',
    confidence: 0.83,
    readings_count: 138,
  },
  {
    device_id: 'example-fridge',
    device_name: 'Refrigerator',
    device_type: 'appliance',
    efficiency_score: 71,
    label: 'good',
    confidence: 0.79,
    readings_count: 144,
  },
  {
    device_id: 'example-waterheater',
    device_name: 'Water Heater',
    device_type: 'appliance',
    efficiency_score: 31,
    label: 'inefficient',
    confidence: 0.86,
    readings_count: 120,
  },
]

export const EXAMPLE_EFFICIENCY: EfficiencySummary = {
  overall_score: 62,
  overall_label: 'good',
  devices: EXAMPLE_EFFICIENCY_DEVICES,
}

// ── Forecast ───────────────────────────────────────────────────────────────
export const EXAMPLE_FORECASTS: DeviceForecast[] = [
  {
    device_id: 'example-home',
    device_name: 'Whole-Home Load',
    device_type: 'meter',
    predictions: {
      '1h': { predicted_kwh: 1.82, lower_bound_kwh: 1.4, upper_bound_kwh: 2.3, horizon: '1h', model_version: 'gbm-example' },
      '6h': { predicted_kwh: 9.6, lower_bound_kwh: 7.8, upper_bound_kwh: 11.9, horizon: '6h', model_version: 'gbm-example' },
      '24h': { predicted_kwh: 41.2, lower_bound_kwh: 34.5, upper_bound_kwh: 49.0, horizon: '24h', model_version: 'gbm-example' },
    },
  },
  {
    device_id: 'example-hvac',
    device_name: 'HVAC Unit (Living Room)',
    device_type: 'hvac',
    predictions: {
      '1h': { predicted_kwh: 0.64, lower_bound_kwh: 0.4, upper_bound_kwh: 0.95, horizon: '1h', model_version: 'gbm-example' },
      '6h': { predicted_kwh: 3.1, lower_bound_kwh: 2.2, upper_bound_kwh: 4.4, horizon: '6h', model_version: 'gbm-example' },
      '24h': { predicted_kwh: 12.8, lower_bound_kwh: 9.6, upper_bound_kwh: 16.5, horizon: '24h', model_version: 'gbm-example' },
    },
  },
]

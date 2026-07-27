'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SpendByCategoryReportDTO } from '@application/dtos/SpendByCategoryReportDTO';
import type { IncomeVsExpenseReportDTO } from '@application/dtos/IncomeVsExpenseReportDTO';
import { useAuth } from '@interfaces/web/AuthContext';
import { ApiError } from '@interfaces/web/apiClient';
import { formatMoney, formatMoneyWhole } from '@interfaces/web/formatMoney';
import { niceTicks } from '@interfaces/web/chartScale';

// Income/expense series colors: a warm/cool pair validated for CVD
// separation and 3:1 surface contrast (green/red fails deutan/protan).
const INCOME_COLOR = '#2a78d6';
const EXPENSE_COLOR = '#e34948';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function currentMonthValue(): string {
  return new Date().toISOString().slice(0, 7);
}

function monthValueMonthsAgo(months: number): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months, 1))
    .toISOString()
    .slice(0, 7);
}

function monthLabel(period: string): string {
  const [year, month] = period.split('-');
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

export default function ReportsPage() {
  const { status, api, logout } = useAuth();

  const [period, setPeriod] = useState(currentMonthValue);
  const [spend, setSpend] = useState<SpendByCategoryReportDTO | null>(null);
  const [spendLoading, setSpendLoading] = useState(false);
  const [spendError, setSpendError] = useState<string | null>(null);

  const [from, setFrom] = useState(() => monthValueMonthsAgo(5));
  const [to, setTo] = useState(currentMonthValue);
  const [trend, setTrend] = useState<IncomeVsExpenseReportDTO | null>(null);
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendError, setTrendError] = useState<string | null>(null);

  const handleAuthError = useCallback(
    (err: unknown, fallback: string, report: (message: string) => void) => {
      if (err instanceof ApiError && err.status === 401) {
        // Stored token is stale/expired — drop the session so the guard
        // sends the user back to /login.
        logout();
        return;
      }
      report(err instanceof ApiError ? err.message : fallback);
    },
    [logout]
  );

  useEffect(() => {
    if (status !== 'authenticated' || !period) return;
    let cancelled = false;
    setSpendLoading(true);
    api
      .getSpendByCategoryReport({ period })
      .then((report) => {
        if (cancelled) return;
        setSpend(report);
        setSpendError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        handleAuthError(err, 'Failed to load spending report', setSpendError);
      })
      .finally(() => {
        if (!cancelled) setSpendLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, api, period, handleAuthError]);

  useEffect(() => {
    if (status !== 'authenticated' || !from || !to) return;
    let cancelled = false;
    setTrendLoading(true);
    api
      .getIncomeVsExpenseReport({ from, to })
      .then((report) => {
        if (cancelled) return;
        setTrend(report);
        setTrendError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        handleAuthError(
          err,
          'Failed to load income vs expense report',
          setTrendError
        );
      })
      .finally(() => {
        if (!cancelled) setTrendLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, api, from, to, handleAuthError]);

  return (
    <section>
      <h1 className="page-title">Reports</h1>

      <h2 className="section-title">Spending by category</h2>
      <div className="filter-bar">
        <label className="form-field">
          Month
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            required
          />
        </label>
      </div>
      {spendError && <p className="form-error">{spendError}</p>}
      {!spendError && spend === null && <p>Loading spending report…</p>}
      {spend !== null && (
        <SpendByCategoryChart report={spend} refetching={spendLoading} />
      )}

      <h2 className="section-title">Income vs expense</h2>
      <div className="filter-bar">
        <label className="form-field">
          From
          <input
            type="month"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </label>
        <label className="form-field">
          To
          <input
            type="month"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </label>
      </div>
      {trendError && <p className="form-error">{trendError}</p>}
      {!trendError && trend === null && <p>Loading income vs expense…</p>}
      {trend !== null && (
        <IncomeVsExpenseChart report={trend} refetching={trendLoading} />
      )}
    </section>
  );
}

function SpendByCategoryChart({
  report,
  refetching,
}: {
  report: SpendByCategoryReportDTO;
  refetching: boolean;
}) {
  const items = useMemo(
    () => [...report.categories].sort((a, b) => b.spentCents - a.spentCents),
    [report.categories]
  );
  const maxSpent = items.length > 0 ? items[0].spentCents : 0;

  return (
    <div className={`report-card${refetching ? ' report-refetching' : ''}`}>
      <div className="report-headline">
        <span className="report-headline-label">
          Total spent in {monthLabel(report.period)}
        </span>
        <span className="report-headline-value">
          {formatMoney(report.totalSpentCents, report.baseCurrency)}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="report-empty">No expenses recorded for this month.</p>
      ) : (
        <ul className="spend-bar-list">
          {items.map((item) => {
            const share =
              report.totalSpentCents > 0
                ? Math.round((item.spentCents / report.totalSpentCents) * 100)
                : 0;
            return (
              <li
                key={item.categoryId ?? 'uncategorized'}
                className="spend-bar-row"
              >
                <span className="spend-bar-label">
                  {item.categoryName ?? 'Uncategorized'}
                </span>
                <span className="spend-bar-track">
                  <span
                    className="spend-bar-fill"
                    style={{
                      width:
                        maxSpent > 0
                          ? `${(item.spentCents / maxSpent) * 100}%`
                          : 0,
                    }}
                  />
                </span>
                <span className="spend-bar-value">
                  {formatMoney(item.spentCents, report.baseCurrency)}
                  <span className="spend-bar-share">{share}%</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Grouped-column chart geometry (SVG user units). The design width is
// held near the card's rendered width so the chart draws at ~1:1 and
// text/bars keep their intended size: month slots widen to fill short
// ranges, and the canvas grows past the nominal width for long ones.
const CHART = {
  nominalWidth: 900,
  marginLeft: 72,
  marginRight: 16,
  marginTop: 12,
  marginBottom: 28,
  plotHeight: 240,
  minSlotWidth: 64,
  barWidth: 20,
  barGap: 2,
};

// Columns grow from the baseline with a rounded cap and a square foot.
function columnPath(x: number, y: number, w: number, h: number): string {
  const r = Math.min(4, h, w / 2);
  return [
    `M${x},${y + h}`,
    `L${x},${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `L${x + w - r},${y}`,
    `Q${x + w},${y} ${x + w},${y + r}`,
    `L${x + w},${y + h}`,
    'Z',
  ].join(' ');
}

function IncomeVsExpenseChart({
  report,
  refetching,
}: {
  report: IncomeVsExpenseReportDTO;
  refetching: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const points = report.points;
  const ticks = useMemo(() => {
    const max = Math.max(
      0,
      ...points.map((p) => Math.max(p.incomeCents, p.expenseCents))
    );
    return niceTicks(max);
  }, [points]);
  const scaleMax = ticks[ticks.length - 1];

  const { marginLeft, marginRight, marginTop, marginBottom, plotHeight } =
    CHART;
  const width = Math.max(
    CHART.nominalWidth,
    marginLeft + marginRight + points.length * CHART.minSlotWidth
  );
  const slotWidth = (width - marginLeft - marginRight) / points.length;
  const height = marginTop + plotHeight + marginBottom;
  const baseline = marginTop + plotHeight;

  const yFor = (cents: number) =>
    baseline - (scaleMax > 0 ? (cents / scaleMax) * plotHeight : 0);
  const slotX = (index: number) => marginLeft + index * slotWidth;
  const groupWidth = CHART.barWidth * 2 + CHART.barGap;

  // Thin out x labels when the range is wide so they never collide.
  const labelStep = Math.max(1, Math.ceil(points.length / 10));

  return (
    <div className={`report-card${refetching ? ' report-refetching' : ''}`}>
      <div className="chart-legend">
        <span className="chart-legend-item">
          <span
            className="chart-legend-swatch"
            style={{ backgroundColor: INCOME_COLOR }}
          />
          Income
        </span>
        <span className="chart-legend-item">
          <span
            className="chart-legend-swatch"
            style={{ backgroundColor: EXPENSE_COLOR }}
          />
          Expense
        </span>
      </div>

      <div className="chart-plot-wrap" style={{ maxWidth: width }}>
        <svg
          className="chart-plot"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Income vs expense per month from ${monthLabel(report.from)} to ${monthLabel(report.to)}`}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={marginLeft}
                x2={width - marginRight}
                y1={yFor(tick)}
                y2={yFor(tick)}
                className={tick === 0 ? 'chart-baseline' : 'chart-gridline'}
              />
              <text
                x={marginLeft - 8}
                y={yFor(tick)}
                className="chart-tick-label"
                textAnchor="end"
                dominantBaseline="middle"
              >
                {formatMoneyWhole(tick, report.baseCurrency)}
              </text>
            </g>
          ))}

          {points.map((point, index) => {
            const groupLeft =
              slotX(index) + (slotWidth - groupWidth) / 2;
            const incomeY = yFor(point.incomeCents);
            const expenseY = yFor(point.expenseCents);
            const [year, month] = point.period.split('-');
            const showYear = index === 0 || month === '01';
            return (
              <g
                key={point.period}
                className={
                  hovered === index ? 'chart-group chart-group-active' : 'chart-group'
                }
              >
                {point.incomeCents > 0 && (
                  <path
                    d={columnPath(
                      groupLeft,
                      incomeY,
                      CHART.barWidth,
                      baseline - incomeY
                    )}
                    fill={INCOME_COLOR}
                  />
                )}
                {point.expenseCents > 0 && (
                  <path
                    d={columnPath(
                      groupLeft + CHART.barWidth + CHART.barGap,
                      expenseY,
                      CHART.barWidth,
                      baseline - expenseY
                    )}
                    fill={EXPENSE_COLOR}
                  />
                )}
                {index % labelStep === 0 && (
                  <text
                    x={slotX(index) + slotWidth / 2}
                    y={baseline + 18}
                    className="chart-tick-label"
                    textAnchor="middle"
                  >
                    {MONTH_NAMES[Number(month) - 1]}
                    {showYear ? ` ${year.slice(2)}` : ''}
                  </text>
                )}
                <rect
                  x={slotX(index)}
                  y={marginTop}
                  width={slotWidth}
                  height={plotHeight}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${monthLabel(point.period)}: income ${formatMoney(point.incomeCents, report.baseCurrency)}, expense ${formatMoney(point.expenseCents, report.baseCurrency)}, net ${formatMoney(point.netCents, report.baseCurrency)}`}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                />
              </g>
            );
          })}
        </svg>

        {hovered !== null && points[hovered] && (
          <div
            className="chart-tooltip"
            style={{
              left: `${((slotX(hovered) + slotWidth / 2) / width) * 100}%`,
            }}
          >
            <div className="chart-tooltip-title">
              {monthLabel(points[hovered].period)}
            </div>
            <div className="chart-tooltip-row">
              <span
                className="chart-tooltip-key"
                style={{ backgroundColor: INCOME_COLOR }}
              />
              <strong>
                {formatMoney(points[hovered].incomeCents, report.baseCurrency)}
              </strong>
              <span className="chart-tooltip-series">Income</span>
            </div>
            <div className="chart-tooltip-row">
              <span
                className="chart-tooltip-key"
                style={{ backgroundColor: EXPENSE_COLOR }}
              />
              <strong>
                {formatMoney(points[hovered].expenseCents, report.baseCurrency)}
              </strong>
              <span className="chart-tooltip-series">Expense</span>
            </div>
            <div className="chart-tooltip-row">
              <span className="chart-tooltip-key chart-tooltip-key-net" />
              <strong>
                {formatMoney(points[hovered].netCents, report.baseCurrency)}
              </strong>
              <span className="chart-tooltip-series">Net</span>
            </div>
          </div>
        )}
      </div>

      <details className="report-table-details">
        <summary>View as table</summary>
        <div className="table-wrap">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Month</th>
                <th className="cell-amount">Income</th>
                <th className="cell-amount">Expense</th>
                <th className="cell-amount">Net</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.period}>
                  <td>{monthLabel(point.period)}</td>
                  <td className="cell-amount">
                    {formatMoney(point.incomeCents, report.baseCurrency)}
                  </td>
                  <td className="cell-amount">
                    {formatMoney(point.expenseCents, report.baseCurrency)}
                  </td>
                  <td className="cell-amount">
                    {formatMoney(point.netCents, report.baseCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

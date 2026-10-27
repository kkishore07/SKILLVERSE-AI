import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = 'blue' }) {
  const colorMap = {
    blue: 'from-blue-600 to-indigo-600 text-blue-600 bg-blue-50',
    indigo: 'from-indigo-600 to-purple-600 text-indigo-600 bg-indigo-50',
    emerald: 'from-emerald-600 to-teal-600 text-emerald-600 bg-emerald-50',
    amber: 'from-amber-500 to-orange-600 text-amber-600 bg-amber-50',
    purple: 'from-purple-600 to-pink-600 text-purple-600 bg-purple-50',
  };

  const selectedColor = colorMap[color] || colorMap.blue;
  const iconBg = selectedColor.split(' ').slice(2).join(' ');

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 card-shadow card-hover flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && (
            <span className={`font-semibold flex items-center gap-1 ${
              trend.startsWith('+') ? 'text-emerald-600' : 'text-slate-600'
            }`}>
              {trend} {trendLabel && <span className="text-slate-400 font-normal">{trendLabel}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

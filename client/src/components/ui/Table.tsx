import React from 'react';

export const TableContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <table
      className={`w-full text-left text-sm text-slate-200 border-collapse ${className}`}
      {...props}
    >
      {children}
    </table>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <thead
      className={`bg-slate-950/70 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 font-semibold ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <tbody className={`divide-y divide-slate-800/80 ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<
  React.HTMLAttributes<HTMLTableRowElement> & { isHoverable?: boolean }
> = ({ children, isHoverable = true, className = '', ...props }) => {
  return (
    <tr
      className={`
        transition-colors duration-150
        ${isHoverable ? 'hover:bg-slate-800/50' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <th className={`px-4 py-3.5 select-none ${className}`} {...props}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <td className={`px-4 py-3.5 align-middle ${className}`} {...props}>
      {children}
    </td>
  );
};

export const TableEmptyRow: React.FC<{
  colSpan: number;
  message?: string;
}> = ({ colSpan, message = 'No data available' }) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-8 text-center text-sm text-slate-500 italic"
      >
        {message}
      </td>
    </tr>
  );
};

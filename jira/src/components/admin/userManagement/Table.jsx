import "../../../styles/Table.css";

const Table = ({ children, className = "" }) => {
  return (
    <div className={`table-container ${className}`}>
      <table className="table">{children}</table>
    </div>
  );
};

const TableHeader = ({ children }) => {
  return <thead className="table-header">{children}</thead>;
};

const TableBody = ({ children }) => {
  return <tbody className="table-body">{children}</tbody>;
};

const TableRow = ({ children, className = "" }) => {
  return <tr className={`table-row ${className}`}>{children}</tr>;
};

const TableCell = ({ children, className = "" }) => {
  return <td className={`table-cell ${className}`}>{children}</td>;
};

const TableHeaderCell = ({ children, className = "" }) => {
  return <th className={`table-header-cell ${className}`}>{children}</th>;
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.HeaderCell = TableHeaderCell;

export default Table;

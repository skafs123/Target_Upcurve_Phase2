import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { List, ListItem } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

const headCells = [
  { id: "date", numeric: false, disablePadding: true, label: "Date" },
  { id: "receivedOrGiven", numeric: false, disablePadding: true, label: "Received/Given" },
  { id: "recognitionType", numeric: false, disablePadding: true, label: "Recognition Type" },
  { id: "points", numeric: true, disablePadding: true, label: "Points" },
  { id: "recognizedBy", numeric: false, disablePadding: true, label: "Recognized By" },
  { id: "coreValue", numeric: false, disablePadding: true, label: "Core Value" },
  { id: "behaviours", numeric: false, disablePadding: true, label: "Behaviours" },
  { id: "recognitionNote", numeric: false, disablePadding: true, label: "Recognition Note" },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: "#2E5AAC", border: "2px solid grey.500" }}>
        {headCells.map((headCell) => {
          const isActive = orderBy === headCell.id;

          return (
            <TableCell
              sx={{
                border: "1px solid white",
                padding: "10px",
                textAlign: 'center',
                color: isActive ? 'black' : 'white', 
                backgroundColor: isActive ? '#2E5AAC' : '#2E5AAC', 
                '&:hover': {
                  backgroundColor: isActive ? '#2E5AAC' : alpha('#2E5AAC', 0.7), 
                },
                whiteSpace: 'nowrap',
                maxWidth: '150px', 
                fontSize: '1rem',
              }}
              key={headCell.id}
              align={headCell.numeric ? "center" : "center"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                <Box sx={{ textAlign: 'center' }}>
                  {headCell.label}
                </Box>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

/** 
  function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Recognition Table
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

**/

export default function EnhancedTable({ userId, timePeriod, selectedButton }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("date");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [dense, setDense] = React.useState(false);
  const [expandedPostIndex, setExpandedPostIndex] = useState(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState({});
  const textRefs = useRef([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = [];
        const period = timePeriod === "10" ? 'year' : 'month';
  
        if (selectedButton === "all") {
          const [givenData, receivedData] = await Promise.all([
            fetch(`http://localhost:8080/dashboard/viewall/given/${period}/${userId}`).then(res => res.json()),
            fetch(`http://localhost:8080/dashboard/viewall/received/${period}/${userId}`).then(res => res.json())
          ]);
          response = [...givenData, ...receivedData];
        } else if (selectedButton === "sent") {
          response = await fetch(`http://localhost:8080/dashboard/viewall/given/${period}/${userId}`).then(res => res.json());
        } else if (selectedButton === "received") {
          response = await fetch(`http://localhost:8080/dashboard/viewall/received/${period}/${userId}`).then(res => res.json());
        }
  
        response.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
  
        setRows(response.map((row, index) => ({
          id: index,
          date: new Date(row.postDate).toLocaleDateString(),  
          receivedOrGiven: row.recOrGiv,
          recognitionType: row.postType, 
          points: row.points,
          recognizedBy: row.recognizerName,
          coreValue: row.coreValue,
          behaviours: row.behaviours,
          recognitionNote: row.postString
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [userId, timePeriod, selectedButton]);  
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(() => {
    const checkTextOverflow = () => {
      const newOverflowStatus = {};
      textRefs.current.forEach((ref, index) => {
        if (ref) {
          const isOverflowing = ref.scrollHeight > ref.clientHeight;
          newOverflowStatus[index] = isOverflowing;
        }
      });
      setIsTextOverflowing(newOverflowStatus);
    };
  
    checkTextOverflow();
    window.addEventListener('resize', checkTextOverflow);
    
    return () => {
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [rows]);

  const handleTogglePostExpand = (index) => {
    setExpandedPostIndex(expandedPostIndex === index ? null : index);
  };

  return (
    <Box sx={{ width: "100%", px: 0 }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <Table
            sx={{ minWidth: 750, border: "2px solid grey.500" }}
            aria-labelledby="tableTitle"
            size="medium"
            padding="normal"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                .slice()
                .sort((a, b) => {
                  const isAsc = order === "asc";
                  return (a[orderBy] < b[orderBy] ? -1 : 1) * (isAsc ? 1 : -1);
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(index);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const isExpanded = expandedPostIndex === index;
                  
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, index)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      sx={{ border: "2px solid lightgrey" }}
                    >
                      <TableCell component="th" id={labelId} scope="row" align="center" sx={{ px: '2px', border: "1px solid lightgrey" }}>{row.date}</TableCell>
                      <TableCell align="center" sx={{ px: '2px', border: "1px solid lightgrey" }}>{row.receivedOrGiven}</TableCell>
                      <TableCell align="center" sx={{ px: '2px', border: "1px solid lightgrey" }}>
                        <Chip
                          label={
                            <div style={{
                              maxWidth: '150px',
                              maxHeight: '100px',  
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word', 
                              whiteSpace: 'normal', 
                              textAlign: 'center',
                              display: 'inline-block' 
                            }}>
                              {row.recognitionType}
                            </div>
                          }
                          sx={{
                            backgroundColor: row.recognitionType === 'Shout out' ? '#F5C300' : '#7FBF7F',
                            color: 'black',
                            borderRadius: '5px',
                            padding: '6px 8px', 
                            fontSize: '0.875rem',
                            width: '100%',
                            height: 'auto',      
                            maxWidth: '150px', 
                            maxHeight: '100px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ px: '2px', border: "1px solid lightgrey" }}>
                      <Chip
                          label={row.points}
                          sx={{
                            backgroundColor: 'white',
                            border: '3px solid #2E5AAC',
                            borderRadius: '5px', 
                            padding: '2px', 
                            fontSize: '0.875rem',
                            width: '70px',
                            textAlign: 'center',
                            width: '70px' 
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ px: '2px', border: "1px solid lightgrey" }}>{row.recognizedBy}</TableCell>
                      <TableCell align="center" sx={{ px: '2px', border: "1px solid lightgrey" }}>{row.coreValue}</TableCell>
                      <TableCell align="center" sx={{ px: '2px', border: "1px solid lightgrey" }}>
                        <List sx={{ padding: 2, margin: 0, listStyleType: 'disc', display: 'inline-block', textAlign: 'center', width: '70%' }}>
                          {row.behaviours && row.behaviours.map((behaviour, index) => (
                            <ListItem key={index} sx={{ padding: '0px', margin: '4px 5px', display: 'list-item', textAlign: 'center', justifyContent: 'center', width: '80%', whiteSpace: 'nowrap' }}>
                              {behaviour}
                            </ListItem>
                          ))}
                        </List>
                      </TableCell>
                      <TableCell align="center" sx={{ padding: '4px', border: "1px solid lightgrey", position: 'relative' }}>
                        <div
                            ref={el => textRefs.current[index] = el}
                            style={{
                              maxHeight: expandedPostIndex === index? 'none' : '60px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal',
                              textAlign: 'justify',
                            }}
                          >
                            {row.recognitionNote}
                          </div>
                          {isTextOverflowing[index] && (
                            <button
                              onClick={() => handleTogglePostExpand(index)}
                              style={{
                                position: 'relative',
                                top: '8px',
                                left: '80px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: theme.palette.primary.main,
                                cursor: 'pointer',
                                zIndex: 1,
                              }}
                            >
                              {expandedPostIndex === index ? 'Read Less' : '... Read More'}
                            </button>
                          )}
                        </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import label from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';

export default function StickyHeadTable({ darkMode, activeButton}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = useState(true);
  const [fetchTasks, setFetchTasks] = useState([]);
  const userid = localStorage.getItem('authid');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        //console.log("user id : ",userid)

        if (activeButton === 'pending') {
          response = await axios.get(`https://todo-backend-9gy2.onrender.com/api/task/pending/${userid}`);
        } else if (activeButton === 'today') {
          response = await axios.get(`https://todo-backend-9gy2.onrender.com/api/task/today/${userid}`);
        } else {
          response = await axios.get(`https://todo-backend-9gy2.onrender.com/api/task/completed/${userid}`);
        }
        setFetchTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userid, activeButton]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCheckboxChange = async (taskId) => {
    try {
      console.log("button clicked : ")
      await axios.put(`https://todo-backend-9gy2.onrender.com/api/task/statusupdate/${taskId}`);
      window.location.reload();
      //fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`https://todo-backend-9gy2.onrender.com/api/task/taskdelete/${taskId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: darkMode ? '#28282B' : '#fff' }}>
      <TableContainer sx={{ maxHeight: 370 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Skeleton animation="wave" variant="rectangular" width="100%" height={100} sx={{ bgcolor: 'grey.900' }}/>
                  <Skeleton animation="wave" variant="rectangular" width="100%" height={100} sx={{ bgcolor: 'grey.900' }}/>
                  <Skeleton animation="wave" variant="rectangular" width="100%" height={100} sx={{ bgcolor: 'grey.900' }}/>
                </TableCell>
              </TableRow>
            ) : (
              fetchTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={task._id}>
                  {activeButton !== 'completed' ? (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onChange={() => handleCheckboxChange(task._id)}
                        color="primary"
                      />
                    </TableCell>
                  ) : (
                    <TableCell padding="checkbox">
                      <Checkbox disabled checked />
                    </TableCell>
                  )}
                  <TableCell align="left" style={{ color: darkMode ? 'white' : 'black' }}>{task.task}</TableCell>
                  <TableCell align="right" style={{ color: darkMode ? 'white' : 'black' }}>{formatDate(task.dueDate)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteTask(task._id)} sx={{'&:hover': { color: 'red'}}}>
                        <DeleteIcon sx={{color: darkMode ? 'white' : ''}}/>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={fetchTasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{color: darkMode ? 'white' : 'black'}}
      />
    </Paper>
  );
}

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

export default function StickyHeadTable({ darkMode, activeButton}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [fetchTasks, setFetchTasks] = useState([]);
  const userid = localStorage.getItem('authid');

  useEffect(() => {
    const fetchTasks = async () => {
    if(activeButton==='pending'){
        try {
            console.log('user id : ',userid)
            const response = await axios.get(`https://todo-backend-9gy2.onrender.com/api/task/pending/${userid}`);
            console.log('data : ',response)
            setFetchTasks(response.data);
        } catch (error) {
            console.error('Error fetching pending tasks:', error);
        }
        }
        else if(activeButton==='today'){
            try {
                console.log('user id : ',userid)
                const response = await axios.get(`https://todo-backend-9gy2.onrender.com/api/task/today/${userid}`);
                setFetchTasks(response.data);
            } catch (error) {
                console.error('Error fetching completed tasks:', error);
            }
            }
        else{
            try {
                console.log('user id : ',userid)
                const response = await axios.get(`https://todo-backend-9gy2.onrender.com/api/task/completed/${userid}`);
                setFetchTasks(response.data);
            } catch (error) {
                console.error('Error fetching completed tasks:', error);
            }
        }
    }
    fetchTasks();
  }, [userid, activeButton]);
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCheckboxChange = async (taskId) => {
    try {
      await axios.put(`https://todo-backend-9gy2.onrender.com/api/task/statusupdate/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: darkMode ? '#28282B' : '#fff' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableBody>
            {fetchTasks.map((task) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={task._id}>
                {activeButton !== 'completed' ? (
                    <Checkbox {...label}
                    onChange={() => handleCheckboxChange(task._id)}
                    />
                  ) : (
                    <Checkbox {...label} disabled checked style={{color:'#2196f3'}} />
                  )}
                <TableCell align="left" style={{ color: darkMode ? 'white' : 'black' }}>{task.task}</TableCell>
                <TableCell align="right" style={{ color: darkMode ? 'white' : 'black' }}>{task.dueDate}</TableCell>
              </TableRow>
            ))}
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
      />
    </Paper>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Tooltip } from '@mui/material';
import Button from '@mui/joy/Button';

import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import { Modal } from '@mui/material';
import { Dialog } from '@mui/material';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

export default function BasicModalDialog() {
  const [open, setOpen] = React.useState(false);
  

  const [formData, setFormData] = useState({
    task: '',
    dueDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authid = localStorage.getItem('authid');
    const currentDate = new Date();

    const formDataWithDate = {
        ...formData,
        userid: authid,
        createDate: currentDate
    };

    console.log('data : ',formDataWithDate)

    try {
        const response = await axios.post('https://todo-backend-9gy2.onrender.com/api/task/add', formDataWithDate);
        console.log('Success:', response.data);
        setOpen(false); // Close the modal after successful submission
    } catch (error) {
        console.error('Error:', error);
        // Handle errors here
    }
};



  return (
    <Box>
      <Button
        color="primary"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
        sx={{bgcolor:'primary.main', color:'#fff', fontSize: '1rem'}}
      >
        Add Task
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Dialog>
          <DialogTitle>Create new task</DialogTitle>
          <DialogContent>Fill in the details for your new task.</DialogContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl>
                <TextField
                  label="Task"
                  type="text"
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  variant="outlined"
                  autoFocus
                  required
                />
              </FormControl>
              <FormControl>
                <TextField
                  label="Date"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </FormControl>
              <Tooltip describeChild title="Does not add if it already exists.">
                <Button type="submit" variant="outlined" href="#outlined-buttons">Submit</Button>
              </Tooltip>
            </Stack>
          </form>
        </Dialog>
      </Modal>
    </Box>
  );
}
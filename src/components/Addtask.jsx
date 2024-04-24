import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Tooltip } from '@mui/material';
import Button from '@mui/joy/Button';

import FormControl from '@mui/joy/FormControl';
import LoadingButton from '@mui/lab/LoadingButton';

import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import { Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

export default function BasicModalDialog() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
    setLoading(true);
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
        setOpen(false);
        window.location.reload();
    } catch (error) {
        console.error('Error:', error);
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
        <ModalDialog>
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
                <LoadingButton
                  size="small"
                  type='submit'
                  //onClick={handleClick}
                  loading={loading}
                  loadingIndicator="Submiting…"
                  variant="outlined"
                >
                  <span>Submit</span>
                </LoadingButton>

              </Tooltip>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
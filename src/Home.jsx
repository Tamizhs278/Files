// App.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, TextField, Typography, List, ListItem, ListItemText,
  Paper, DialogContentText, Snackbar, Alert, CircularProgress,
  DialogContent as MuiDialogContent, InputAdornment, Skeleton, MenuItem, Select
} from '@mui/material';
import { Delete, Edit, Save, Download, Visibility, Search } from '@mui/icons-material';
import {
  addDoc, collection, query, getDocs,
  doc, deleteDoc, updateDoc
} from "firebase/firestore";
import { db } from './Auth';

export default function App() {
  const [sfiles, setSFiles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [tempName, setTempName] = useState('');
  const [open, setOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const CLOUDINARY_CLOUD_NAME = "db3nu8wmn";
  const CLOUDINARY_UPLOAD_PRESET = "mySevai";

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    setLoadingList(true);
    const q = query(collection(db, "Files"));
    const snapshot = await getDocs(q);
    let files = [];
    snapshot.forEach((doc) => {
      files.push({ ...doc.data(), id: doc.id });
    });
    setSFiles(files);
    setLoadingList(false);
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => {
    setOpen(false);
    setUploadName('');
    setUploadFile(null);
    setProgress(0);
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleImageAdd = async () => {
    if (!uploadFile || !uploadName) return;

    const fileExtension = uploadFile.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      setError('Only .jpg, .jpeg, and .png files are allowed.');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }
      });
      xhr.onload = async () => {
        const data = JSON.parse(xhr.responseText);
        if (data.secure_url) {
          const newDoc = { Img: data.secure_url, Name: uploadName };
          await addDoc(collection(db, "Files"), newDoc);
          await getFiles();
          handleCloseDialog();
        } else {
          setError('Upload failed. Please try again.');
          setSnackbarOpen(true);
        }
        setLoading(false);
      };
      xhr.send(formData);
    } catch (err) {
      setLoading(false);
      setError('Upload failed.');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "Files", id));
    await getFiles();
    setConfirmDeleteId(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setTempName(sfiles[index].Name);
  };

  const handleSave = async (index) => {
    const image = sfiles[index];
    await updateDoc(doc(db, "Files", image.id), { Name: tempName });
    await getFiles();
    setEditIndex(null);
  };

  const handleListItemClick = (img) => {
    setSelectedImage(img);
    setPreviewOpen(true);
  };

  const handleDownload = (img) => {
    const link = document.createElement('a');
    link.href = img.Img;
    link.download = img.Name;
    link.click();
  };

  const filteredFiles = sfiles
    .filter(file => file.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortOrder === 'asc'
      ? a.Name.localeCompare(b.Name)
      : b.Name.localeCompare(a.Name));

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #2c3e50, #4ca1af)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#f0f0f0'
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 700,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#ffffff' }}>
          📁 Documents File Manager
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            placeholder="Search images"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#fff' }} />
                </InputAdornment>
              )
            }}
            sx={{
              input: { color: '#fff' },
              label: { color: '#ddd' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#aaa' },
                '&:hover fieldset': { borderColor: '#fff' },
              },
              width: '60%'
            }}
          />
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            sx={{
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#aaa' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' }
            }}
          >
            <MenuItem value="asc">Sort A-Z</MenuItem>
            <MenuItem value="desc">Sort Z-A</MenuItem>
          </Select>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #ff9966, #ff5e62)',
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          Upload Image
        </Button>

        <Box sx={{ maxHeight: 400, overflowY: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: 2, p: 2 }}>
          {loadingList ? (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
            ))
          ) : (
            <List>
              {filteredFiles.map((img, index) => (
                <ListItem key={img.id} sx={{ background: 'rgba(255,255,255,0.1)', mb: 1, borderRadius: 2 }}>
                  {editIndex === index ? (
                    <TextField
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      size="small"
                      fullWidth
                      InputProps={{ style: { color: '#fff' } }}
                    />
                  ) : (
                    <ListItemText primary={img.Name} primaryTypographyProps={{ sx: { color: '#fff' } }} />
                  )}
                  <IconButton onClick={() => handleListItemClick(img)} color="primary"><Visibility /></IconButton>
                  {editIndex === index ? (
                    <IconButton onClick={() => handleSave(index)} color="success"><Save /></IconButton>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(index)} color="info"><Edit /></IconButton>
                      <IconButton onClick={() => setConfirmDeleteId(img.id)} color="error"><Delete /></IconButton>
                    </>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleCloseDialog} >
        <DialogTitle sx={{ color: 'rgb(218, 50, 53)' }}>Upload Image</DialogTitle>
        <MuiDialogContent>
          <TextField
            margin="dense"
            label="Image Name"
            fullWidth
            variant="outlined"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value.toUpperCase())}
            sx={{
              input: { color: "rgb(0, 0, 0)" },
              label: { color: ' rgb(0, 59, 251)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgb(0, 0, 0)' },
                '&:hover fieldset': { borderColor: '#ddd' },
              },
            }}
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>Select File<input hidden accept="image/*" type="file" onChange={(e) => setUploadFile(e.target.files[0])} /></Button>
          {uploadFile && <Typography mt={2} sx={{ color: '#fff', fontStyle: 'italic' }}>Selected File: {uploadFile.name}</Typography>}
          {loading && <Box sx={{ width: '100%', mt: 2 }}><Typography variant="caption" sx={{ color: '#fff' }}>{progress}%</Typography><Box sx={{ background: '#333', borderRadius: 1 }}><Box sx={{ width: `${progress}%`, height: 8, background: '#00e676', borderRadius: 1 }} /></Box></Box>}
        </MuiDialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: ' #e30000' }}>Cancel</Button>
          <Button onClick={handleImageAdd} variant="contained" disabled={!uploadFile || !uploadName || loading}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <MuiDialogContent><Typography>Are you sure you want to delete this image?</Typography></MuiDialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={() => handleDelete(confirmDeleteId)}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <DialogTitle>Preview: {selectedImage?.Name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <img src={selectedImage?.Img} alt={selectedImage?.Name} style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 12 }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button onClick={() => handleDownload(selectedImage)} variant="contained" color="primary">Download</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
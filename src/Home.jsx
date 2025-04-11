import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, TextField, Typography, List, ListItem, ListItemText,
  Paper, Snackbar, Alert, Skeleton, MenuItem, Select, InputAdornment
} from '@mui/material';
import { Delete, Edit, Save, Download, Visibility, PictureAsPdf, Search } from '@mui/icons-material';
import { addDoc, collection, query, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from './Auth';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {  useNavigate } from 'react-router-dom';

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
  const imageRef = useRef();

  const CLOUDINARY_CLOUD_NAME = "db3nu8wmn";
  const CLOUDINARY_UPLOAD_PRESET = "mySevai";

  const navigate = useNavigate();

  useEffect(() => { getFiles(); }, []);

  const getFiles = async () => {
    setLoadingList(true);
    const q = query(collection(db, "Files"));
    const snapshot = await getDocs(q);
    let files = [];
    snapshot.forEach((doc) => files.push({ ...doc.data(), id: doc.id }));
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
    const ext = uploadFile.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      setError('Only .jpg, .jpeg, .png allowed.');
      setSnackbarOpen(true); return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded * 100) / e.total));
      });
      xhr.onload = async () => {
        const data = JSON.parse(xhr.responseText);
        if (data.secure_url) {
          await addDoc(collection(db, "Files"), { Img: data.secure_url, Name: uploadName });
          await getFiles(); handleCloseDialog();
        } else {
          setError('Upload failed.'); setSnackbarOpen(true);
        }
        setLoading(false);
      };
      xhr.send(formData);
    } catch {
      setError('Upload failed.'); setSnackbarOpen(true); setLoading(false);
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
    await updateDoc(doc(db, "Files", sfiles[index].id), { Name: tempName });
    await getFiles(); setEditIndex(null);
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

  const handleDownloadPDF = async () => {
    const element = imageRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`${selectedImage.Name}.pdf`);
  };

  const filteredFiles = sfiles
    .filter(file => file.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortOrder === 'asc'
      ? a.Name.localeCompare(b.Name)
      : b.Name.localeCompare(a.Name));

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(120deg, #2c3e50, #4ca1af)', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#f0f0f0' }}>
      <Paper elevation={10} sx={{ p: 4, width: '100%', maxWidth: 700, backdropFilter: 'blur(20px)', background: 'rgba(255, 255, 255, 0.1)', borderRadius: 4 }}>
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
              width: '60%',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#aaa' },
                '&:hover fieldset': { borderColor: '#fff' }
              }
            }}
          />
          <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
            sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#aaa' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' } }}
          >
            <MenuItem value="asc">Sort A-Z</MenuItem>
            <MenuItem value="desc">Sort Z-A</MenuItem>
          </Select>
        </Box>

        <Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Button variant="contained" onClick={handleOpenDialog}
          sx={{ mb: 3, background: 'linear-gradient(135deg, #ff9966, #ff5e62)', color: '#fff', fontWeight: 'bold' }}>
          Upload Image
        </Button>
        <Button  variant="contained" onClick={()=>navigate("/loginhistory")}
          sx={{ mb: 3, background: 'linear-gradient(135deg, #ff9966, #ff5e62)', color: '#fff', fontWeight: 'bold' }}>
          Login History
        </Button>
        </Box>

        <Box sx={{ maxHeight: 400, overflowY: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: 2, p: 2 }}>
          {loadingList ? [...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          )) : (
            <List>
              {filteredFiles.map((img, index) => (
                <ListItem key={img.id} sx={{ background: 'rgba(255,255,255,0.1)', mb: 1, borderRadius: 2 }}>
                  {editIndex === index ? (
                    <TextField defaultValue={img.Name} onChange={(e) => setTempName(e.target.value)} size="small" fullWidth InputProps={{ style: { color: '#fff' } }} />
                  ) : (
                    <ListItemText primary={img.Name} primaryTypographyProps={{ sx: { color: '#fff' } }} />
                  )}
                  <IconButton onClick={() => handleListItemClick(img)} sx={{ color: 'rgb(255, 255, 255)' }}><Visibility /></IconButton>
                  {editIndex === index ? (
                    <IconButton onClick={() => handleSave(index)}><Save /></IconButton>
                  ) : (
                    <>
                      {/* <IconButton onClick={() => handleEdit(index)} sx={{ color: 'rgb(0, 255, 255)' }}><Edit /></IconButton> */}
          <IconButton onClick={() => handleDownload(selectedImage)} sx={{ color: 'rgb(0, 217, 255)' }}><Download /></IconButton>

                      <IconButton onClick={() => setConfirmDeleteId(img.id)} sx={{ color: ' #f44336' }}><Delete /></IconButton>
                    </>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <TextField label="Image Name" fullWidth value={uploadName} onChange={(e) => setUploadName(e.target.value)} />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>Select File<input hidden accept="image/*" type="file" onChange={(e) => setUploadFile(e.target.files[0])} /></Button>
          {uploadFile && <Typography mt={2}>Selected: {uploadFile.name}</Typography>}
          {loading && <Box sx={{ width: '100%', mt: 2 }}><Typography>{progress}%</Typography><Box sx={{ background: '#444', borderRadius: 1 }}><Box sx={{ width: `${progress}%`, height: 8, background: '#00e676' }} /></Box></Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleImageAdd} disabled={!uploadFile || !uploadName || loading}>Upload</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this image?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={() => handleDelete(confirmDeleteId)}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <DialogTitle>Preview: {selectedImage?.Name}</DialogTitle>
        <DialogContent>
          <Box ref={imageRef}><img src={selectedImage?.Img} alt={selectedImage?.Name} style={{ maxWidth: '100%', borderRadius: 12 }} /></Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          {/* <IconButton onClick={() => handleDownload(selectedImage)} sx={{ color: 'rgb(0, 255, 26)' }}><Download /></IconButton> */}
          <IconButton onClick={handleDownloadPDF} sx={{ color: 'rgb(255, 17, 0)' }}><PictureAsPdf /></IconButton>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}

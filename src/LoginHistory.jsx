import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination,
    TextField, Button, Stack, IconButton, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Visibility, Edit, Delete, FilterList, CalendarToday } from '@mui/icons-material';
import { collection, query, getDocs ,deleteDoc,doc} from "firebase/firestore";
import { db } from './Auth';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

export default function Dashboard() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deviceFilter, setDeviceFilter] = useState('');
    const [osFilter, setOSFilter] = useState('');

    useEffect(() => {
        getLoginHistory();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, deviceFilter, osFilter, logs]);

    const getLoginHistory = async () => {
        try {
            const q = query(collection(db, "LoginHistory"));
            const snapshot = await getDocs(q);
            let files = [];
            snapshot.forEach((doc) => files.push({ ...doc.data(), id: doc.id }));

            files.sort((a, b) => b.time - a.time);
            setLogs(files);
        } catch (err) {
            console.error("Error fetching login history:", err);
            setError("Failed to fetch login history.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "LoginHistory", id));
        await getLoginHistory();
       
      };

    const applyFilters = () => {
        let result = [...logs];
        if (searchQuery) {
            result = result.filter(log => log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (deviceFilter) {
            result = result.filter(log => log.device === deviceFilter);
        }
        if (osFilter) {
            result = result.filter(log => log.os === osFilter);
        }
        setFilteredLogs(result);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["Email", "Browser", "OS", "Device", "Type", "Vendor", "IP", "Location", "Time"];
        const tableRows = filteredLogs.map(log => [
            log.userEmail,
            log.browser,
            log.os,
            log.device,
            log.type,
            log.vendor,
            log.ip || 'N/A',
            log.location || 'N/A',
            new Date(log.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        ]);

        autoTable(doc, { head: [tableColumn], body: tableRows });
        doc.save("login_history.pdf");
    };

    const headers = [
        { label: "Email", key: "userEmail" },
        { label: "Browser", key: "browser" },
        { label: "OS", key: "os" },
        { label: "Device", key: "device" },
        { label: "Type", key: "type" },
        { label: "Vendor", key: "vendor" },
        { label: "IP", key: "ip" },
        { label: "Location", key: "location" },
        { label: "Time", key: "time" },
    ];

    const csvData = filteredLogs.map(log => ({
        ...log,
        time: new Date(log.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    }));

    const uniqueDevices = [...new Set(logs.map(log => log.device).filter(Boolean))];
    const uniqueOS = [...new Set(logs.map(log => log.os).filter(Boolean))];

    return (
        <Box p={4} sx={{ minHeight: '100vh', background: 'linear-gradient(145deg, #1f1f47, #2d2d7a)', color: '#fff' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', background: 'linear-gradient(to right, #00f260, #0575e6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                User Device Log
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} mb={3}>
                <TextField
                    label="Search by Email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff', borderColor: '#00f260' } }}
                />
                <FormControl fullWidth>
                    <InputLabel sx={{ color: '#fff' }}>Filter by Device</InputLabel>
                    <Select
                        value={deviceFilter}
                        onChange={(e) => setDeviceFilter(e.target.value)}
                        sx={{ color: '#fff' }}
                    >
                        <MenuItem value="">All Devices</MenuItem>
                        {uniqueDevices.map(device => (
                            <MenuItem key={device} value={device}>{device}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel sx={{ color: '#fff' }}>Filter by OS</InputLabel>
                    <Select
                        value={osFilter}
                        onChange={(e) => setOSFilter(e.target.value)}
                        sx={{ color: '#fff' }}
                    >
                        <MenuItem value="">All OS</MenuItem>
                        {uniqueOS.map(os => (
                            <MenuItem key={os} value={os}>{os}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <CSVLink data={csvData} headers={headers} filename="login_history.csv" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" sx={{ background: '#00f260', color: '#000', boxShadow: '0 0 10px #00f260' }}>
                        Export CSV
                    </Button>
                </CSVLink>
                <Button variant="contained" onClick={exportPDF} sx={{ background: '#0575e6', color: '#fff', boxShadow: '0 0 10px #0575e6' }}>
                    Export PDF
                </Button>
            </Stack>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Paper
                    sx={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: 4,
                        overflowX: 'auto',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        border: '1px solid rgba(255, 255, 255, 0.18)'
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Browser</TableCell>
                                    <TableCell>OS</TableCell>
                                    <TableCell>Device</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Vendor</TableCell>
                                    <TableCell>IP</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Options</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">No login history found.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((log, idx) => (
                                            <TableRow
                                                key={log.id}
                                                sx={{
                                                    backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)'
                                                }}
                                            >
                                                <TableCell>{log.userEmail}</TableCell>
                                                <TableCell>{log.browser}</TableCell>
                                                <TableCell>{log.os}</TableCell>
                                                <TableCell>{log.device}</TableCell>
                                                <TableCell>{log.type}</TableCell>
                                                <TableCell>{log.vendor}</TableCell>
                                                <TableCell>{log.ip || 'N/A'}</TableCell>
                                                <TableCell>{log.location || 'N/A'}</TableCell>
                                                <TableCell>{new Date(log.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</TableCell>
                                                <TableCell>
                                                    <IconButton color="primary"><Visibility /></IconButton>
                                                    <IconButton color="secondary"><Edit /></IconButton>
                                                    <IconButton color="error" onClick={()=>handleDelete(log.id)}><Delete /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={filteredLogs.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </Box>
    );
}

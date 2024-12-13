'use client';

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useIdContext } from '../../context/IdContext';

interface Celular {
  code: string;
  model: string;
  price: number;
  brand: string;
  color: string;
  startDate: string;
  endDate: string;
}

export default function TableProducts() {
  const [celulares, setCelulares] = React.useState<Celular[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [type, setType] = React.useState<'active' | 'deleted'>('active');
  const [showDeletedPhones, setShowDeletedPhones] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedPhone, setSelectedPhone] = React.useState<Celular | null>(null);
  const router = useRouter();
  const { setId } = useIdContext();

  const fetchCelulares = React.useCallback(async () => {
    const endpoint = type === 'active' ? 'phone' : 'deletedPhones';
    try {
      const response = await axios.get(`https://api-melhorcom.onrender.com/api/${endpoint}`);
      setCelulares(response.data);
    } catch (error) {
      console.error(`Erro ao buscar celulares ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  React.useEffect(() => {
    fetchCelulares();
  }, [type]);

  const handleToggleView = () => {
    setShowDeletedPhones(!showDeletedPhones);
    setType(showDeletedPhones ? 'active' : 'deleted');
  };

  const handleNavigate = () => {
    router.push('/cadastrar');
  };

  const handleEdit = (id: string) => {
    setId(id);
    router.push('/cadastrar');
  };

  const handleDelete = async (phoneCode: string) => {
    try {
      const response = await axios.delete(`https://api-melhorcom.onrender.com/api/phone/${phoneCode}`);
      if (response.status === 200) {
        setCelulares((prevPhones) => prevPhones.filter((phone) => phone.code !== phoneCode));
        setOpenDialog(false);
        alert('Celular excluído com sucesso');
      } else {
        alert('Erro ao excluir celular');
      }
    } catch (error) {
      console.error('Erro ao excluir celular:', error);
      alert('Erro ao excluir celular');
    }
  };

  const openDeleteDialog = (phone: Celular) => {
    setSelectedPhone(phone);
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDialog(false);
    setSelectedPhone(null);
  };

  const formatPrice = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const translateColor = (color: string): string => {
    const colorTranslations: { [key: string]: string } = {
      Black: 'PRETO',
      White: 'BRANCO',
      Gold: 'OURO',
      Pink: 'ROSA',
    };
    return colorTranslations[color] || color;
  };

  return (
    <Box component="section" sx={{ py: 2, mx: { xs: 2, sm: 4, md: 1, lg: 10 }, marginTop: 10 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ mb: { xs: 2, sm: 0 } }}>Produtos</Typography>
        <Button
          variant="contained"
          onClick={handleNavigate}
          sx={{
            backgroundColor: '#DAE3ED',
            color: '#1D1D1D',
            border: '1px solid #1D1D1D',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              cursor: 'pointer',
            },
            mt: { xs: 2, sm: 0 },
          }}
        >
          <AddIcon />
          <SmartphoneIcon /> Adicionar
        </Button>
      </Box>

      <TableContainer sx={{ marginTop: 2, display: { xs: 'none', sm: 'block' } }}>
        {isLoading ? (
          <Typography variant="h6" align="center" sx={{ p: 4 }}>
            Carregando dados...
          </Typography>
        ) : (
          <Table sx={{ minWidth: 1000 }} aria-label="Tabela de produtos">
            <TableHead sx={{ border: 1 }}>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Cor</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ border: '1px solid' }}>
              {celulares.map((cel) => (
                <TableRow
                  key={cel.code}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: 2 }}
                >
                  <TableCell component="th" scope="row">{cel.code}</TableCell>
                  <TableCell>{cel.model}</TableCell>
                  <TableCell>{formatPrice(cel.price)}</TableCell>
                  <TableCell>{cel.brand}</TableCell>
                  <TableCell>{translateColor(cel.color)}</TableCell>
                  <TableCell>
                    <ModeEditIcon
                      onClick={() => handleEdit(cel.code)}
                      sx={{
                        cursor: type === 'deleted' ? 'not-allowed' : 'pointer',
                        color: type === 'deleted' ? 'gray' : 'inherit',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteIcon
                      onClick={() => openDeleteDialog(cel)}
                      sx={{
                        cursor: type === 'deleted' ? 'not-allowed' : 'pointer',
                        color: type === 'deleted' ? 'gray' : 'inherit',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Box sx={{ display: { xs: 'block', sm: 'none' }, marginTop: 2 }}>
        {isLoading ? (
          <Typography variant="h6" align="center" sx={{ p: 4 }}>
            Carregando dados...
          </Typography>
        ) : (
          celulares.map((cel) => (
            <Box key={cel.code} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2, p: 2 }}>
              <Typography variant="body1"><strong>Código:</strong> {cel.code}</Typography>
              <Typography variant="body1"><strong>Modelo:</strong> {cel.model}</Typography>
              <Typography variant="body1"><strong>Preço:</strong> {cel.price}</Typography>
              <Typography variant="body1"><strong>Marca:</strong> {cel.brand}</Typography>
              <Typography variant="body1"><strong>Cor:</strong> {cel.color}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <ModeEditIcon onClick={() => handleEdit(cel.code)} sx={{ cursor: 'pointer' }} />
                <DeleteIcon onClick={() => openDeleteDialog(cel)} sx={{ cursor: 'pointer' }} />
              </Box>
            </Box>
          ))
        )}
      </Box>

      {!isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'end', pt: 4 }}>
          <Button
            variant="contained"
            onClick={handleToggleView}
            sx={{
              color: '#1D1D1D',
              backgroundColor: '#DAE3ED',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
              },
            }}
          >
            {showDeletedPhones ? 'Ver Celulares Ativos' : 'Ver Celulares Excluídos'}
          </Button>
        </Box>
      )}

      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza de que deseja excluir este celular?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">Cancelar</Button>
          <Button onClick={() => selectedPhone && handleDelete(selectedPhone.code)} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
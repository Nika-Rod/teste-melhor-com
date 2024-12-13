import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { TextField, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
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

export default function RegisterProducts() {
    const [celularData, setCelularData] = React.useState<Celular>({
        code: '',
        model: '',
        price: 0,
        brand: '',
        color: '',
        startDate: '',
        endDate: '',
    });

    const router = useRouter();
    const { id, resetId } = useIdContext();
    const isEditing = Boolean(id);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleNavigateBack = () => {
        resetId();
        router.push('/');
    };

    React.useEffect(() => {
        if (isEditing && id) {
            fetchCelularData(id);
        }
    }, [isEditing, id]);

    const fetchCelularData = async (code: string) => {
        try {
            const response = await axios.get(`https://api-melhorcom.onrender.com/api/phone/code/${code}`);
            setCelularData(response.data);
        } catch (error) {
            console.error('Erro ao buscar celular:', error);
        }
    };

    const saveCelular = async () => {
        setIsLoading(true);
        try {
            if (isEditing && !celularData.startDate) {
                alert('A data de início é obrigatória!');
                return;
            }

            if (!celularData.startDate || !celularData.endDate) {
                alert('As datas de início e fim são obrigatórias!');
                return;
            }

            const celularDataFormatado = {
                ...celularData,
                price: Number(celularData.price),
                startDate: celularData.startDate.split('/').reverse().join('-'),
                endDate: celularData.endDate ? celularData.endDate.split('/').reverse().join('-') : null,
            };

            if (isEditing) {
                await axios.patch(`https://api-melhorcom.onrender.com/api/phone/code/${celularData.code}`, celularDataFormatado);
                alert('Celular atualizado com sucesso');
            } else {
                const generatedCode = uuidv4().replace(/[^0-9]/g, '').slice(0, 8);
                await axios.post(`https://api-melhorcom.onrender.com/api/phone`, {
                    ...celularDataFormatado,
                    code: generatedCode,
                });
                alert('Novo celular cadastrado com sucesso');
            }

            router.push('/');
        } catch (error) {
            console.error('Erro ao salvar celular:', error);
            alert('Erro ao salvar celular. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setCelularData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setCelularData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateChange = (newDate: Dayjs | null, field: string) => {
        if (newDate === null) {
            return; // Retorna sem fazer nada se a data for nula
        }

        const formattedDate = newDate.format('DD/MM/YYYY');

        if (field === 'startDate') {
            const startDate = dayjs(formattedDate, 'DD/MM/YYYY');
            const minStartDate = dayjs('25/12/2018', 'DD/MM/YYYY');

            if (startDate.isBefore(minStartDate)) {
                alert('A data de início deve ser posterior a 25/12/2018.');
                return;
            }
        } else if (field === 'endDate') {
            const startDate = dayjs(celularData.startDate, 'DD/MM/YYYY');
            const endDate = dayjs(formattedDate, 'DD/MM/YYYY');

            if (endDate.isBefore(startDate)) {
                alert('A data de fim deve ser posterior à data de início.');
                return;
            }
        }

        setCelularData((prevData) => ({
            ...prevData,
            [field]: formattedDate
        }));
    };

    const handleSave = () => {
        saveCelular();
    };

    return (
        <Box sx={{ margin: 10 }}>
            <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 4 }}>
                {isEditing ? 'Editar Celular' : 'Cadastrar Celular'}
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        id="model"
                        label="Modelo"
                        variant="outlined"
                        placeholder='XT2041-1'
                        value={celularData.model}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        id="brand"
                        label="Marca"
                        variant="outlined"
                        placeholder='Motorola'
                        value={celularData.brand}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="cor-select-label">Cor</InputLabel>
                        <Select
                            labelId="cor-select-label"
                            name="color"
                            value={celularData.color}
                            onChange={handleSelectChange}
                            label="Cor"
                        >
                            <MenuItem value={'Black'}>Preto</MenuItem>
                            <MenuItem value={'White'}>Branco</MenuItem>
                            <MenuItem value={'Gold'}>Gold</MenuItem>
                            <MenuItem value={'Pink'}>Rosa</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        id="price"
                        label="Preço"
                        variant="outlined"
                        placeholder='1.400,00'
                        value={celularData.price.toString()}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            onChange={(newDate) => handleDateChange(newDate, 'startDate')}
                            format='DD/MM/YYYY'
                            sx={{ width: '100%' }}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            onChange={(newDate) => handleDateChange(newDate, 'endDate')}
                            format='DD/MM/YYYY'
                            sx={{ width: '100%' }}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 3 }}>
                        <Button
                            onClick={handleNavigateBack}
                            variant="outlined"
                            sx={{
                                color: '#1D1D1D',
                                backgroundColor: '#DAE3ED',
                                border: '1px solid',
                                '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' },
                            }}
                        >
                            Voltar
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant="outlined"
                            sx={{
                                color: '#1D1D1D',
                                backgroundColor: '#DAE3ED',
                                border: '1px solid',
                                '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' },
                            }}
                            disabled={isLoading} 
                        >
                            {isEditing ? 'Atualizar' : 'Salvar'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
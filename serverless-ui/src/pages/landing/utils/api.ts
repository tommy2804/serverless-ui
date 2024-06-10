import { AxiosResponse } from 'axios';
import { ContactDetailsDto } from '../../../types/user-dto';
import api from '../../../utils/api';

const API_BASE_URL = '/api';

export const createContactMessage = async (
  contactDetails: ContactDetailsDto,
): Promise<AxiosResponse> => api.post(`${API_BASE_URL}/send-contact-message`, { contactDetails });

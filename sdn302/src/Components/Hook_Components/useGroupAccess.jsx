import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../Context/AppContext';

const useGroupAccess = () => {
    const { groupId } = useParams();
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    // Kiểm tra xem user có nhóm trùng với groupId không
    if (!user || !user.groups?.includes(groupId)) {
        navigate('/not-found');
        return false;
    }

    return true;
};

export default useGroupAccess;


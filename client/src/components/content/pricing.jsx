import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { setLoading } from '../../redux/loading';
import { useDispatch } from 'react-redux';
import { planConfigs } from '../../config/pricing';
import PlanCard from '../wrappers/PlanCard';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setLoading(false));
    }, []);
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-8 text-white" style={{ backgroundColor: "#212121" }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl md:text-3xl font-semibold">Upgrade your plan</h2>
                <button className="text-gray-400 hover:text-white absolute top-6 right-6">
                    <X size={24} onClick={() => navigate('/')} className='cursor-pointer'/>
                </button>
            </div>

            {/* Toggle */}
            {/* <div className="flex justify-center mb-8">
                <div className="bg-gray-800 rounded-lg p-1 inline-flex">
                    <button className="px-4 py-1 rounded-md bg-gray-700 text-white">Personal</button>
                    <button className="px-4 py-1 text-gray-400">Business</button>
                </div>
            </div> */}


            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PlanCard {...planConfigs.free} />
                <PlanCard {...planConfigs.plus} />
                <PlanCard {...planConfigs.pro} />
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
                <p className="text-gray-400">* Plan features and pricing are subject to change</p>
                {/* <p className="mt-2">
                    Plan features and pricing are subject to change.
                </p> */}
            </div>
        </div>
    );
};

export default Pricing;
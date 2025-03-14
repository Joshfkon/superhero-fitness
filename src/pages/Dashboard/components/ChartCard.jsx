import React from 'react';
import { ResponsiveContainer } from 'recharts';
import Card from '../../../components/common/Card';

const ChartCard = ({ title, icon: Icon, children, height = "h-64" }) => {
  return (
    <Card>
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          {Icon && <Icon className="mr-2 h-5 w-5 text-indigo-500" />}
          {title}
        </h3>
        <div className={`mt-2 ${height}`}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default ChartCard; 
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  status?: { label: string; variant: 'default' | 'destructive' | 'outline'; color: string };
  icon?: React.ReactNode;
  updatedAt?: string;
  children?: React.ReactNode;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  status, 
  icon, 
  updatedAt, 
  children 
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-bold text-gray-900">
            {value}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </p>
          {status && (
            <span 
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                status.variant === 'destructive' ? 'bg-red-100 text-red-800' :
                status.variant === 'outline' ? 'bg-gray-100 text-gray-800' :
                'bg-green-100 text-green-800'
              }`}
            >
              {status.label}
            </span>
          )}
        </div>
        {updatedAt && (
          <p className="mt-2 text-sm text-gray-500">
            {updatedAt}
          </p>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

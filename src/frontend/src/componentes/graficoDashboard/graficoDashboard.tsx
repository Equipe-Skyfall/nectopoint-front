import { LineChart, CartesianGrid, XAxis, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";

export default function GraficoDashboard() {
    let dados = [{  'Media banco de horas':16},{  'Media banco de horas':26},{  'Media banco de horas':11},{  'Media banco de horas':15}];
    let width = '100%';
    let height = 200;
return (
   <>
   <ResponsiveContainer width={width} height={height}>
   
    <LineChart  data={dados}
  margin={{ top: 5, right: 30, left: 20, bottom: 0 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
 
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="Media banco de horas" stroke="#82ca9d" />
</LineChart>
   </ResponsiveContainer>
   </>

)}
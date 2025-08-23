import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';

const stages = ['WAITING','WASHING','CLEANING','FINISHED'];

type Car = { id: number; plate: string; status: string; };

export default function Board() {
  const [columns, setColumns] = useState<Record<string, Car[]>>({});
  const load = () => axios.get('/api/cars').then(r => {
    const groups: Record<string, Car[]> = {};
    for (const stage of stages) groups[stage] = [];
    r.data.forEach((c: Car) => { if (groups[c.status]) groups[c.status].push(c); });
    setColumns(groups);
  });
  useEffect(() => { load(); }, []);
  useEffect(() => { const handler = () => load(); window.addEventListener('update', handler); return ()=>window.removeEventListener('update', handler); }, []);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sourceStage = result.source.droppableId;
    const destStage = result.destination.droppableId;
    if (sourceStage === destStage) return;
    const car = columns[sourceStage][result.source.index];
    try {
      await axios.patch(`/api/cars/${car.id}/status`, { status: destStage });
    } catch (e: any) {
      alert(e.response?.data?.error || 'Move failed');
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-4">
        {stages.map(stage => (
          <Droppable droppableId={stage} key={stage}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-200 p-2 rounded min-h-[300px]">
                <div className="font-bold mb-2">{stage}</div>
                {columns[stage]?.map((car, index) => (
                  <Draggable draggableId={car.id.toString()} index={index} key={car.id}>
                    {(p) => (
                      <Link to={`/cars/${car.id}`} ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="block bg-white p-2 mb-2 shadow">
                        {car.plate}
                      </Link>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

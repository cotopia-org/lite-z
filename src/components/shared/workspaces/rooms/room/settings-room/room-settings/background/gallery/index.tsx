import { useNextApi } from '@/hooks/swr';
import { GalleryItemType } from '@/types/gallery';
import React from 'react';
import GalleryItem from './gallery-item';
import FullLoading from '@/components/shared/full-loading';
import TitleEl from '@/components/shared/title-el';

type Props = {
  room_id: number;
  workspace_id: number;
};
export default function Gallery({ room_id, workspace_id }: Props) {
  const galleryItems: GalleryItemType[] = [
    {
      id: '421482149219842198421',
      title: 'Spring 1',
      source: '/assets/mock/gallery/template/spring-1.jpg',
    },
    {
      id: '89421974792147921412',
      title: 'Spring 2',
      source: '/assets/mock/gallery/template/spring-2.jpg',
    },
    {
      id: '79842714921749127498',
      title: 'Spring 3',
      source: '/assets/mock/gallery/template/spring-3.jpg',
    },
    {
      id: '98472149271957129841',
      title: 'Spring 4',
      source: '/assets/mock/gallery/template/spring-4.jpg',
    },
    {
      id: '98472149271957129841',
      title: 'Wall',
      source: '/assets/mock/gallery/template/wall-1.jpg',
    },
    {
      id: '51351251251252412421',
      title: 'Sky',
      source: '/assets/mock/gallery/template/sky-1.jpg',
    },
    {
      id: '40921840921840921842',
      title: 'Sky Clouds',
      source: '/assets/mock/gallery/template/sky-2.jpg',
    },
    {
      id: '904812904821094821',
      title: 'Space',
      source: '/assets/mock/gallery/template/space-1.jpg',
    },
    {
      id: '892742914921764982',
      title: 'Spatial 1',
      source: '/assets/mock/gallery/template/spatial-1.png',
    },
    {
      id: '421421412412421421',
      title: 'Spatial 2',
      source: '/assets/mock/gallery/template/spatial-2.png',
    },
    {
      id: '421842198471894191',
      title: 'Spatial 3',
      source: '/assets/mock/gallery/template/spatial-3.png',
    },
    {
      id: '412421984762198472',
      title: 'Spatial 4',
      source: '/assets/mock/gallery/template/spatial-4.png',
    },
    {
      id: '947219847129847171',
      title: 'Spatial 5',
      source: '/assets/mock/gallery/template/spatial-5.png',
    },
    {
      id: '498127489217428911',
      title: 'Spatial 6',
      source: '/assets/mock/gallery/template/spatial-6.png',
    },
    {
      id: '894981247219847129',
      title: 'Spatial 7',
      source: '/assets/mock/gallery/template/spatial-7.png',
    },
    {
      id: '498217489174982174',
      title: 'Spatial 8',
      source: '/assets/mock/gallery/template/spatial-8.png',
    },
    {
      id: '498214892174289174',
      title: 'Spatial 9',
      source: '/assets/mock/gallery/template/spatial-9.png',
    },
    {
      id: '421974219746124912',
      title: 'Spatial 10',
      source: '/assets/mock/gallery/template/spatial-10.png',
    },
    {
      id: '421847218472149817',
      title: 'Spatial 11',
      source: '/assets/mock/gallery/template/spatial-11.png',
    },
    {
      id: '4128947219847210041',
      title: 'Spatial 12',
      source: '/assets/mock/gallery/template/spatial-12.png',
    },
    {
      id: '4214821749821749124',
      title: 'Spatial 13',
      source: '/assets/mock/gallery/template/spatial-13.png',
    },
    {
      id: '4201987428914616214',
      title: 'Spatial 14',
      source: '/assets/mock/gallery/template/spatial-14.png',
    },
    {
      id: '4129841672489612922',
      title: 'Spatial 13',
      source: '/assets/mock/gallery/template/spatial-13.png',
    },
    {
      id: '4218748291476219641',
      title: 'Spatial 14',
      source: '/assets/mock/gallery/template/spatial-14.png',
    },
    {
      id: '4021974129847698651',
      title: 'Spatial 14',
      source: '/assets/mock/gallery/template/spatial-14.png',
    },
    {
      id: '6476124567412769472',
      title: 'Spatial 15',
      source: '/assets/mock/gallery/template/spatial-15.png',
    },
  ];

  let content = (
    <div className="grid grid-cols-12 gap-2 max-h-[400px] overflow-y-auto">
      {galleryItems.map((gallery) => (
        <div className="col-span-6 md:col-span-3" key={gallery.id}>
          <GalleryItem
            item={gallery}
            room_id={room_id}
            workspace_id={workspace_id}
          />
        </div>
      ))}
    </div>
  );

  if (galleryItems.length === 0)
    content = <span>There is no gallery template yet.</span>;

  return (
    <TitleEl title="Select room background" className="mt-2 gap-y-4">
      {content}
    </TitleEl>
  );
}

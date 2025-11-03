// src/pages/ProfilePage.jsx
import daris from './images/daris.jpg';
import dare from './images/dare.jpg';
import denzel from './images/denzel.jpg';
import faizadri from './images/faizadri.jpg';

export default function ProfilePage() {
  const members = [
    {
      name: 'Daris Muhammad Ilham',
      nim: '21120123130054',
      image_url: daris
    },
    {
      name: 'Darren Nathanael Melakha',
      nim: '21120123120001',
      image_url: dare
    },
    {
      name: 'M. Faiz Adri Ar Rasyid',
      nim: '21120123140183',
      image_url: faizadri
    },
    {
      name: 'Denzel Helguera Simanjuntak',
      nim: '21120123130077',
      image_url: denzel
    }
  ];

  return (
    <div className="p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Kelompok 32 Praktikum PPB 2025</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-6">Anggota kelompok kami:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition-shadow duration-200">
                <img src={m.image_url} alt={m.name} className="w-28 h-28 rounded-full object-cover mb-4" />
                <div className="font-semibold text-lg">{m.name}</div>
                <div className="text-sm text-slate-500">NIM: {m.nim}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

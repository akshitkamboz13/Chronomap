import { useState } from 'react';

export default function PinForm({ onSubmit, onCancel, theme, position }) {
  const [note, setNote] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    
    onSubmit({
      lat: position.lat,
      lng: position.lng,
      note,
      theme
    });
  };
  
  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'GTA5':
        return {
          container: 'bg-gta-dark border-gta-secondary',
          input: 'bg-gray-800 text-gta-primary border-gta-secondary',
          button: 'bg-gta-secondary text-gta-dark hover:bg-gta-primary',
          cancelButton: 'bg-gray-700 text-gta-primary hover:bg-gray-600',
        };
      case 'RDR2':
        return {
          container: 'bg-rdr2-dark border-rdr2-secondary',
          input: 'bg-gray-800 text-rdr2-primary border-rdr2-secondary',
          button: 'bg-rdr2-secondary text-rdr2-dark hover:bg-rdr2-primary',
          cancelButton: 'bg-gray-700 text-rdr2-primary hover:bg-gray-600',
        };
      case 'RDR':
        return {
          container: 'bg-rdr-dark border-rdr-secondary',
          input: 'bg-gray-800 text-rdr-primary border-rdr-secondary',
          button: 'bg-rdr-secondary text-rdr-dark hover:bg-rdr-primary',
          cancelButton: 'bg-gray-700 text-rdr-primary hover:bg-gray-600',
        };
      case 'Cyberpunk2077':
        return {
          container: 'bg-cyberpunk-dark border-cyberpunk-secondary',
          input: 'bg-gray-800 text-cyberpunk-primary border-cyberpunk-secondary',
          button: 'bg-cyberpunk-secondary text-cyberpunk-dark hover:bg-cyberpunk-primary',
          cancelButton: 'bg-gray-700 text-cyberpunk-primary hover:bg-gray-600',
        };
      default:
        return {
          container: 'bg-gray-800 border-gray-600',
          input: 'bg-gray-700 text-white border-gray-600',
          button: 'bg-blue-600 text-white hover:bg-blue-500',
          cancelButton: 'bg-gray-700 text-white hover:bg-gray-600',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 rounded-lg shadow-lg border ${styles.container} z-20`}>
      <h3 className="text-lg font-bold mb-2">Add Note</h3>
      <p className="text-sm mb-2">
        Location: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className={`w-full p-2 rounded mb-2 ${styles.input}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your note here..."
          rows="3"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className={`px-4 py-2 rounded ${styles.cancelButton}`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded ${styles.button}`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
} 
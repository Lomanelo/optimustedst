import React, { useState } from 'react';
import { 
  professionalCertificates, 
  qualifiDiplomas,
  allPrograms 
} from '../data/optimus-data';
import programService from '../services/programService';
import { serverTimestamp } from 'firebase/firestore';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export default function ImportSamplePrograms() {
  const [isImporting, setIsImporting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [imported, setImported] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Combine all programs
  const allTemplatePrograms = [
    ...professionalCertificates,
    ...qualifiDiplomas,
    ...allPrograms.filter(p => p.level === 'Level 7' || p.level === 'Level 8')
  ];

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setError(null);
      setSuccess(null);
      setImported([]);
      setFailed([]);
      setProgress({ current: 0, total: allTemplatePrograms.length });
      
      // Import each program
      for (let i = 0; i < allTemplatePrograms.length; i++) {
        const program = allTemplatePrograms[i];
        
        try {
          // Prepare the program data
          const programData = {
            title: program.title,
            description: program.description || '',
            shortDescription: program.description ? program.description.substring(0, 150) + '...' : '',
            category: program.specialization || 'General',
            level: program.level,
            type: program.type,
            duration: program.duration,
            durationWeeks: program.durationWeeks || 12,
            price: program.price,
            status: 'published' as 'published' | 'draft',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            enrollments: 0,
            requirements: program.modules || [],
            whatYouWillLearn: program.modules || [],
            originalId: program.id
          };
          
          // Add to Firestore
          const docId = await programService.createProgram(programData);
          
          // Track success
          setImported(prev => [...prev, program.title]);
          
        } catch (err) {
          console.error(`Failed to import ${program.title}:`, err);
          setFailed(prev => [...prev, program.title]);
        }
        
        // Update progress
        setProgress({ current: i + 1, total: allTemplatePrograms.length });
      }
      
      // Show final status
      setSuccess(`Successfully imported ${imported.length} of ${allTemplatePrograms.length} programs`);
      
    } catch (err) {
      console.error('Error during import:', err);
      setError('An error occurred during import. Check the console for details.');
    } finally {
      setIsImporting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Import Sample Programs</h2>
      <p className="text-sm text-gray-500 mb-6">
        This utility will import all sample programs from the static data into the database, 
        making them editable by administrators. This is a one-time setup operation.
      </p>
      
      {!isImporting && !success && (
        <button
          onClick={() => setShowConfirmation(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Import {allTemplatePrograms.length} Sample Programs
        </button>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmation && !isImporting && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Confirm Import</h3>
              <p className="mt-1 text-sm text-amber-700">
                This will import {allTemplatePrograms.length} programs into your database. 
                Are you sure you want to proceed? This can take a few minutes.
              </p>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={handleImport}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Yes, Import All Programs
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Progress */}
      {isImporting && (
        <div className="mt-4">
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Importing programs... ({progress.current} of {progress.total})
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
          
          {/* Live status */}
          <div className="mt-3 max-h-32 overflow-y-auto text-xs">
            {imported.map((name, index) => (
              <div key={`imported-${index}`} className="text-green-600 flex items-center py-0.5">
                <CheckCircle className="h-3 w-3 mr-1" /> Imported: {name}
              </div>
            ))}
            {failed.map((name, index) => (
              <div key={`failed-${index}`} className="text-red-600 flex items-center py-0.5">
                <AlertTriangle className="h-3 w-3 mr-1" /> Failed: {name}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Import Complete</h3>
              <p className="mt-1 text-sm text-green-700">{success}</p>
              {failed.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-600 font-medium">Failed to import {failed.length} programs:</p>
                  <ul className="mt-1 list-disc list-inside text-xs text-red-600">
                    {failed.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-3">
                <button
                  onClick={() => {
                    setSuccess(null);
                    setImported([]);
                    setFailed([]);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Import Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
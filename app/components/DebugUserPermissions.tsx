'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase/firebase';
import { CheckCircle, XCircle, AlertCircle, User, Shield, Database } from 'lucide-react';

const DebugUserPermissions: React.FC = () => {
  const { currentUser, userRole, hasPermission } = useAuth();
  const [userDocument, setUserDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDocument = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserDocument(userDocSnap.data());
        } else {
          setError('User document not found in Firestore');
        }
      } catch (err) {
        console.error('Error fetching user document:', err);
        setError('Failed to fetch user document');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDocument();
  }, [currentUser]);

  const PermissionItem = ({ label, value, icon: Icon }: { label: string; value: boolean | string | undefined; icon: any }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        {typeof value === 'boolean' ? (
          value ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )
        ) : (
          <span className="text-sm text-gray-600">{value || 'Not set'}</span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center text-gray-600 mt-2">Loading user permissions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">User Permissions Debug</h3>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Firebase Auth Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Firebase Authentication
          </h4>
          <div className="space-y-2">
            <PermissionItem 
              label="User Authenticated" 
              value={!!currentUser} 
              icon={CheckCircle}
            />
            <PermissionItem 
              label="User Email" 
              value={currentUser?.email} 
              icon={User}
            />
            <PermissionItem 
              label="User UID" 
              value={currentUser?.uid} 
              icon={Database}
            />
          </div>
        </div>

        {/* Auth Context Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Auth Context
          </h4>
          <div className="space-y-2">
            <PermissionItem 
              label="User Role" 
              value={userRole || 'No role set'} 
              icon={Shield}
            />
            <PermissionItem 
              label="Has Programs Permission" 
              value={hasPermission('programs')} 
              icon={CheckCircle}
            />
            <PermissionItem 
              label="Is Admin" 
              value={userRole === 'admin'} 
              icon={Shield}
            />
          </div>
        </div>

        {/* Firestore Document */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Firestore User Document
          </h4>
          {userDocument ? (
            <div className="space-y-2">
              <PermissionItem 
                label="Document Exists" 
                value={true} 
                icon={CheckCircle}
              />
              <PermissionItem 
                label="Role Field" 
                value={userDocument.role} 
                icon={Shield}
              />
              <PermissionItem 
                label="Programs Permission" 
                value={userDocument.permissions?.programs} 
                icon={Database}
              />
              
              {/* Full document preview */}
              <div className="mt-4">
                <details className="bg-gray-50 rounded-lg p-3">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    View Full Document
                  </summary>
                  <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(userDocument, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">
                ❌ User document not found in Firestore. This is likely the cause of the permission error.
              </p>
            </div>
          )}
        </div>

        {/* Storage Rules Compatibility */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3">Storage Rules Compatibility</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm mb-3">
              <strong>Required for photo uploads:</strong>
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• User must be authenticated ✓</li>
              <li>• User document must exist in Firestore {userDocument ? '✓' : '❌'}</li>
              <li>• User must have <code>role: 'admin'</code> OR <code>permissions.programs: true</code></li>
            </ul>
            
            {!userDocument && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded">
                <p className="text-red-800 text-sm font-medium">
                  🚨 Action Required: Create user document in Firestore
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugUserPermissions;

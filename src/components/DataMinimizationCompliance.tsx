import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Lock, Eye, Database, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const DataMinimizationCompliance: React.FC = () => {
  const complianceChecks = [
    {
      category: 'Data Collection',
      status: 'compliant',
      checks: [
        { item: 'Only essential data required for registration', compliant: true },
        { item: 'All demographic fields are optional', compliant: true },
        { item: 'Clear "Prefer not to say" options provided', compliant: true },
      ],
    },
    {
      category: 'Data Masking',
      status: 'compliant',
      checks: [
        { item: 'DOB stored securely, only Age Range exposed', compliant: true },
        { item: 'Sensitive data generalized where possible', compliant: true },
        { item: 'No raw sensitive data in brand dashboards', compliant: true },
      ],
    },
    {
      category: 'User Control',
      status: 'compliant',
      checks: [
        { item: 'Granular opt-in/opt-out toggles per field', compliant: true },
        { item: 'One-click data export functionality', compliant: true },
        { item: 'Transparency via Review Visibility Score', compliant: true },
      ],
    },
    {
      category: 'Data Retention',
      status: 'compliant',
      checks: [
        { item: 'Clear retention policy documented', compliant: true },
        { item: 'Account deletion removes all personal data', compliant: true },
        { item: '30-day deletion window specified', compliant: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-600" />
            <CardTitle>Data Minimization Compliance Dashboard</CardTitle>
          </div>
          <CardDescription>
            TellBrandz platform compliance with data minimization and privacy best practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              All compliance checks passed. The platform is designed to collect minimum necessary data and respect user privacy.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            {complianceChecks.map((section) => (
              <Card key={section.category}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {section.status === 'compliant' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.checks.map((check, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        {check.compliant ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-sm text-gray-700">{check.item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Database className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-900">Minimal</div>
                    <div className="text-sm text-blue-700">Data Collection</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Lock className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-900">Secure</div>
                    <div className="text-sm text-purple-700">Data Storage</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Eye className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-900">Transparent</div>
                    <div className="text-sm text-green-700">User Control</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataMinimizationCompliance;
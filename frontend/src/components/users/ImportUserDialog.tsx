import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { importApi } from '@/api/apiClient';
import * as XLSX from 'xlsx';

interface ImportUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ImportUserDialog({ open, onOpenChange, onSuccess }: ImportUserDialogProps) {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [successCount, setSuccessCount] = useState<number | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setErrors([]);
            setSuccessCount(null);
        }
    };

    const handleDownloadTemplate = () => {
        const template = [
            {
                Name: 'John Doe',
                Email: 'john@example.com',
                Password: 'securepassword123',
                Role: 'student', // student, teacher, admin
                InstitutionID: 'inst-1' // Optional
            },
            {
                Name: 'Jane Smith',
                Email: 'jane@example.com',
                Password: 'password123',
                Role: 'teacher',
                InstitutionID: 'inst-1'
            }
        ];

        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'template_users.xlsx');
    };

    const handleImport = async () => {
        if (!file) return;

        setIsUploading(true);
        setErrors([]);

        try {
            const result = await importApi.importUsers(file);

            if (result.errors && result.errors.length > 0) {
                setErrors(result.errors);
            }

            if (result.successCount !== undefined) {
                setSuccessCount(result.successCount);
                if (result.successCount > 0) {
                    toast({
                        title: "Import Success",
                        description: `Successfully imported ${result.successCount} users.`,
                    });
                    onSuccess();
                }
            }

            if ((!result.errors || result.errors.length === 0)) {
                onOpenChange(false);
                setFile(null);
            }

        } catch (error: any) {
            setErrors([error.message || "An unexpected error occurred"]);
            toast({
                title: "Import Failed",
                description: "Failed to import users.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Import Users from Excel
                    </DialogTitle>
                    <DialogDescription>
                        Upload an Excel file (.xlsx) to bulk import users.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Download Template */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-foreground">Template</h4>
                            <p className="text-sm text-muted-foreground">
                                Download proper format
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                            <Download className="h-3 w-3 mr-2" />
                            Download
                        </Button>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label>Select File</Label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className={`h-10 w-10 mx-auto mb-4 ${file ? 'text-primary' : 'text-muted-foreground'}`} />
                            {file ? (
                                <div>
                                    <p className="text-foreground font-medium truncate max-w-[300px] mx-auto">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Click to change file
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-foreground font-medium">
                                        Click to upload or drag & drop
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        .xlsx or .xls
                                    </p>
                                </>
                            )}
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {/* Status/Errors */}
                    {errors.length > 0 && (
                        <Alert variant="destructive" className="max-h-[150px] overflow-y-auto">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <p className="font-semibold mb-1">Errors ({errors.length}):</p>
                                <ul className="list-disc list-inside text-xs space-y-1">
                                    {errors.map((error, i) => (
                                        <li key={i}>{error}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    {successCount !== null && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-900/10 dark:border-green-900">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-green-600 dark:text-green-400">
                                Processed with {successCount} successful imports.
                            </AlertDescription>
                        </Alert>
                    )}

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={!file || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            'Import Users'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

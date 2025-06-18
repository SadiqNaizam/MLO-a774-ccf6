import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DownloadCloud, FileArchive, Laptop, Settings2, X } from 'lucide-react';

const exportFormSchema = z.object({
  projectName: z.string().min(1, { message: "Project name is required." }).default("MyGeneratedProject"),
  exportFormat: z.enum(["zip", "vscode"], {
    required_error: "Please select an export format.",
  }),
  includeAssets: z.boolean().default(true),
  minifyCode: z.boolean().default(false),
  openInEditor: z.boolean().default(false).optional(), // Specific to VSCode export
});

type ExportFormValues = z.infer<typeof exportFormSchema>;

const ExportProjectModalPage: React.FC = () => {
  const navigate = useNavigate();
  console.log('ExportProjectModalPage loaded');

  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: {
      projectName: "MyNewProject",
      exportFormat: undefined, // User must select
      includeAssets: true,
      minifyCode: false,
      openInEditor: true,
    },
  });

  const onSubmit = (data: ExportFormValues) => {
    console.log("Exporting project with data:", data);
    // Placeholder for actual export logic
    // Example: await exportProject(data);

    toast.success(`Project "${data.projectName}" export initiated!`, {
      description: `Format: ${data.exportFormat === 'zip' ? 'ZIP Archive' : 'VSCode'}. Check your downloads or VSCode.`,
      action: {
        label: "OK",
        onClick: () => console.log("Toast OK clicked"),
      },
    });
    navigate(-1); // Close modal on successful submission
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      navigate(-1); // Navigate back if the dialog is closed by other means (e.g., Esc key)
    }
  };
  
  const selectedExportFormat = form.watch("exportFormat");

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DownloadCloud className="mr-2 h-5 w-5" />
            Export Project
          </DialogTitle>
          <DialogDescription>
            Configure your export settings and download your project files or export to VSCode.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2 px-1" id="export-project-form">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MyAwesomeApp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exportFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Export Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an export format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="zip">
                        <div className="flex items-center">
                          <FileArchive className="mr-2 h-4 w-4" />
                          Download as ZIP Archive
                        </div>
                      </SelectItem>
                      <SelectItem value="vscode">
                        <div className="flex items-center">
                          <Laptop className="mr-2 h-4 w-4" />
                          Export to VSCode
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center">
                <Settings2 className="mr-2 h-4 w-4 text-muted-foreground" />
                Options
              </Label>
              <FormField
                control={form.control}
                name="includeAssets"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Include Assets</FormLabel>
                      <FormDescription className="text-xs">
                        Bundle images, fonts, and other static assets.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minifyCode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Minify Code</FormLabel>
                      <FormDescription className="text-xs">
                        Optimize JavaScript, CSS, and HTML for production.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {selectedExportFormat === 'vscode' && (
                 <FormField
                  control={form.control}
                  name="openInEditor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Open in VSCode</FormLabel>
                        <FormDescription className="text-xs">
                          Automatically open the project in VSCode after export.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" form="export-project-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Exporting..." : (
              <>
                {selectedExportFormat === 'zip' ? <FileArchive className="mr-2 h-4 w-4" /> : <Laptop className="mr-2 h-4 w-4" />}
                Export Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportProjectModalPage;
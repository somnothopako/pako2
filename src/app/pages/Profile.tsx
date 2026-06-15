import { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Save, X, Undo, Redo } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { DatePicker } from '@/app/components/ui/date-picker';
import { mockUser } from '@/app/data/mockData';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: 'Kerry',
    surname: '',
    preferredName: 'Kerry',
    dateOfBirth: new Date('1995/08/15'),
    email: mockUser.email,
    mobileCountryCode: '+27',
    mobileNumber: '823456789',
    workCountryCode: '+27',
    workNumber: '',
    saIdPassportNumber: '',
    maritalStatus: 'Single',
    cityOfResidence: '',
    provinceOfResidence: '',
    countryOfResidence: 'South Africa',
    countryOfCitizenship: 'South Africa',
    gender: 'Female',
    // Address fields
    streetAddress: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(formData);
  const [history, setHistory] = useState<typeof formData[]>([formData]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lastEditDate, setLastEditDate] = useState<Date | null>(new Date('2025/01/12')); // Mock last edit date
  
  // Address edit mode state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [originalAddressData, setOriginalAddressData] = useState({
    streetAddress: formData.streetAddress,
    suburb: formData.suburb,
    city: formData.city,
    province: formData.province,
    postalCode: formData.postalCode,
    country: formData.country,
  });
  const [addressHistory, setAddressHistory] = useState<Array<typeof originalAddressData>>([originalAddressData]);
  const [addressHistoryIndex, setAddressHistoryIndex] = useState(0);
  
  // Dialog states
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showWeeklyLimitDialog, setShowWeeklyLimitDialog] = useState(false);
  const [showAddressSaveDialog, setShowAddressSaveDialog] = useState(false);
  const [showAddressCancelDialog, setShowAddressCancelDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Calculate if user can edit (weekly limit)
  const canEdit = () => {
    if (!lastEditDate) return true;
    const daysSinceLastEdit = Math.floor((new Date().getTime() - lastEditDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastEdit >= 7;
  };

  const daysUntilNextEdit = () => {
    if (!lastEditDate) return 0;
    const daysSinceLastEdit = Math.floor((new Date().getTime() - lastEditDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - daysSinceLastEdit);
  };

  // Warn user before leaving page/closing tab when editing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing || isEditingAddress) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditing, isEditingAddress]);

  // Handle data changes with history tracking
  const handleDataChange = (newData: typeof formData) => {
    setFormData(newData);
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleEdit = () => {
    if (!canEdit()) {
      setShowWeeklyLimitDialog(true);
      return;
    }
    setIsEditing(true);
    setOriginalData(formData);
    setHistory([formData]);
    setHistoryIndex(0);
  };

  const handleCancelEdit = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setShowCancelDialog(false);
    setHistory([originalData]);
    setHistoryIndex(0);
    toast.info('Changes discarded');
  };

  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    setIsEditing(false);
    setLastEditDate(new Date());
    setShowSaveDialog(false);
    toast.success('Profile updated successfully!');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setFormData(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setFormData(history[historyIndex + 1]);
    }
  };

  const confirmLeave = () => {
    setIsEditing(false);
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const cancelLeave = () => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  };

  // Handle back button with unsaved changes warning
  const handleBackClick = () => {
    if (isEditing || isEditingAddress) {
      setShowUnsavedDialog(true);
      setPendingNavigation(() => () => navigate(-1));
    } else {
      navigate(-1);
    }
  };

  // Address edit functions
  const handleAddressEdit = () => {
    setIsEditingAddress(true);
    setOriginalAddressData({
      streetAddress: formData.streetAddress,
      suburb: formData.suburb,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      country: formData.country,
    });
    setAddressHistory([originalAddressData]);
    setAddressHistoryIndex(0);
  };

  const handleAddressCancelEdit = () => {
    setShowAddressCancelDialog(true);
  };

  const confirmAddressCancel = () => {
    setFormData({
      ...formData,
      streetAddress: originalAddressData.streetAddress,
      suburb: originalAddressData.suburb,
      city: originalAddressData.city,
      province: originalAddressData.province,
      postalCode: originalAddressData.postalCode,
      country: originalAddressData.country,
    });
    setIsEditingAddress(false);
    setShowAddressCancelDialog(false);
    setAddressHistory([originalAddressData]);
    setAddressHistoryIndex(0);
    toast.info('Changes discarded');
  };

  const handleAddressSaveClick = () => {
    setShowAddressSaveDialog(true);
  };

  const confirmAddressSave = () => {
    setIsEditingAddress(false);
    setLastEditDate(new Date());
    setShowAddressSaveDialog(false);
    toast.success('Profile updated successfully!');
  };

  const handleAddressUndo = () => {
    if (addressHistoryIndex > 0) {
      setAddressHistoryIndex(addressHistoryIndex - 1);
      setFormData({
        ...formData,
        streetAddress: addressHistory[addressHistoryIndex - 1].streetAddress,
        suburb: addressHistory[addressHistoryIndex - 1].suburb,
        city: addressHistory[addressHistoryIndex - 1].city,
        province: addressHistory[addressHistoryIndex - 1].province,
        postalCode: addressHistory[addressHistoryIndex - 1].postalCode,
        country: addressHistory[addressHistoryIndex - 1].country,
      });
    }
  };

  const handleAddressRedo = () => {
    if (addressHistoryIndex < addressHistory.length - 1) {
      setAddressHistoryIndex(addressHistoryIndex + 1);
      setFormData({
        ...formData,
        streetAddress: addressHistory[addressHistoryIndex + 1].streetAddress,
        suburb: addressHistory[addressHistoryIndex + 1].suburb,
        city: addressHistory[addressHistoryIndex + 1].city,
        province: addressHistory[addressHistoryIndex + 1].province,
        postalCode: addressHistory[addressHistoryIndex + 1].postalCode,
        country: addressHistory[addressHistoryIndex + 1].country,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>

          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
              {mockUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{mockUser.name}</h1>
              <p className="text-sm text-muted-foreground">Member since 12 June 2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="personal" className="cursor-pointer">Personal Details</TabsTrigger>
            <TabsTrigger value="address" className="cursor-pointer">Address</TabsTrigger>
            <TabsTrigger value="kyc" className="cursor-pointer">KYC</TabsTrigger>
            <TabsTrigger value="tax" className="cursor-pointer">Tax Info</TabsTrigger>
            <TabsTrigger value="bank" className="cursor-pointer">Bank Accounts</TabsTrigger>
          </TabsList>

          {/* Personal Details Tab */}
          <TabsContent value="personal">
            <Card className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-center flex-1">Personal Details</h2>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUndo}
                      disabled={historyIndex === 0}
                      variant="outline"
                      size="sm"
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleRedo}
                      disabled={historyIndex === history.length - 1}
                      variant="outline"
                      size="sm"
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Edit Information Banner */}
              {lastEditDate && !isEditing && (
                <div className="bg-muted/50 p-4 rounded-lg mb-6 max-w-3xl mx-auto">
                  <p className="text-sm text-muted-foreground text-center">
                    Last edited: {lastEditDate.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {!canEdit() && ` • Next edit available in ${daysUntilNextEdit()} days`}
                  </p>
                </div>
              )}
              
              <div className="space-y-10 max-w-3xl mx-auto">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleDataChange({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="surname">Surname</Label>
                      <Input
                        id="surname"
                        value={formData.surname}
                        onChange={(e) => handleDataChange({ ...formData, surname: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="preferredName">Preferred Name</Label>
                      <Input
                        id="preferredName"
                        value={formData.preferredName}
                        onChange={(e) => handleDataChange({ ...formData, preferredName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date Of Birth</Label>
                      <DatePicker
                        id="dob"
                        value={formData.dateOfBirth}
                        onChange={(date) => handleDataChange({ ...formData, dateOfBirth: date })}
                        placeholder="YYYY/MM/DD"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleDataChange({ ...formData, gender: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full bg-input-background border border-input">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Rather not say">Rather not say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground border-b pb-2">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleDataChange({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <div className="flex gap-2">
                        <select
                          id="mobileCountryCode"
                          className="bg-input-background border border-input rounded-md px-3 py-2 text-sm w-24"
                          value={formData.mobileCountryCode}
                          onChange={(e) => handleDataChange({ ...formData, mobileCountryCode: e.target.value })}
                          disabled={!isEditing}
                        >
                          <option value="+27">+27</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+91">+91</option>
                          <option value="+61">+61</option>
                          <option value="+86">+86</option>
                          <option value="+81">+81</option>
                          <option value="+33">+33</option>
                          <option value="+49">+49</option>
                          <option value="+39">+39</option>
                        </select>
                        <Input
                          id="mobile"
                          type="tel"
                          value={formData.mobileNumber}
                          onChange={(e) => handleDataChange({ ...formData, mobileNumber: e.target.value })}
                          className="flex-1"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="work">Work Number</Label>
                      <div className="flex gap-2">
                        <select
                          id="workCountryCode"
                          className="bg-input-background border border-input rounded-md px-3 py-2 text-sm w-24"
                          value={formData.workCountryCode}
                          onChange={(e) => handleDataChange({ ...formData, workCountryCode: e.target.value })}
                          disabled={!isEditing}
                        >
                          <option value="+27">+27</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+91">+91</option>
                          <option value="+61">+61</option>
                          <option value="+86">+86</option>
                          <option value="+81">+81</option>
                          <option value="+33">+33</option>
                          <option value="+49">+49</option>
                          <option value="+39">+39</option>
                        </select>
                        <Input
                          id="work"
                          type="tel"
                          value={formData.workNumber}
                          onChange={(e) => handleDataChange({ ...formData, workNumber: e.target.value })}
                          className="flex-1"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Identity & Residence Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground border-b pb-2">Identity & Residence</h3>
                  
                  {/* SA ID Note */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Note: If you are not a South African resident or citizen but would like access to a ZAR account you will need to enter a valid SA ID.{' '}
                      <a href="#" className="text-primary hover:underline">Click here</a> for more information on the regulatory changes
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="saIdPassportNumber">SA ID Number/Passport Number</Label>
                      <Input
                        id="saIdPassportNumber"
                        value={formData.saIdPassportNumber}
                        onChange={(e) => handleDataChange({ ...formData, saIdPassportNumber: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Marital Status</Label>
                      <Select
                        value={formData.maritalStatus}
                        onValueChange={(value) => handleDataChange({ ...formData, maritalStatus: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full bg-input-background border border-input">
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cityOfResidence">City of Residence</Label>
                      <Input
                        id="cityOfResidence"
                        value={formData.cityOfResidence}
                        onChange={(e) => handleDataChange({ ...formData, cityOfResidence: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="provinceOfResidence">Province of Residence</Label>
                      <Select 
                        value={formData.provinceOfResidence} 
                        onValueChange={(value) => handleDataChange({ ...formData, provinceOfResidence: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="provinceOfResidence">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gauteng">Gauteng</SelectItem>
                          <SelectItem value="Western Cape">Western Cape</SelectItem>
                          <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                          <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                          <SelectItem value="Free State">Free State</SelectItem>
                          <SelectItem value="Limpopo">Limpopo</SelectItem>
                          <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                          <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                          <SelectItem value="North West">North West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="countryOfResidence">Country of Residence</Label>
                      <Select 
                        value={formData.countryOfResidence} 
                        onValueChange={(value) => handleDataChange({ ...formData, countryOfResidence: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="countryOfResidence">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="South Africa">South Africa</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="countryOfCitizenship">Country of Citizenship</Label>
                      <Select 
                        value={formData.countryOfCitizenship} 
                        onValueChange={(value) => handleDataChange({ ...formData, countryOfCitizenship: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="countryOfCitizenship">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="South Africa">South Africa</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Edit and Save Buttons */}
                <div className="flex justify-end pt-4">
                  {isEditing ? (
                    <div className="flex gap-3">
                      <Button onClick={handleCancelEdit} variant="outline" size="lg" className="px-8">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveClick} size="lg" className="px-8">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleEdit} size="lg" className="px-8">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address">
            <Card className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold mb-6 text-center">Address</h2>
                {isEditingAddress && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddressUndo}
                      disabled={addressHistoryIndex === 0}
                      variant="outline"
                      size="sm"
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleAddressRedo}
                      disabled={addressHistoryIndex === addressHistory.length - 1}
                      variant="outline"
                      size="sm"
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    value={formData.streetAddress}
                    onChange={(e) => handleDataChange({ ...formData, streetAddress: e.target.value })}
                    disabled={!isEditingAddress}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="suburb">Suburb</Label>
                    <Input
                      id="suburb"
                      value={formData.suburb}
                      onChange={(e) => handleDataChange({ ...formData, suburb: e.target.value })}
                      disabled={!isEditingAddress}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleDataChange({ ...formData, city: e.target.value })}
                      disabled={!isEditingAddress}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Select value={formData.province} onValueChange={(value) => handleDataChange({ ...formData, province: value })} disabled={!isEditingAddress}>
                      <SelectTrigger id="province">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gauteng">Gauteng</SelectItem>
                        <SelectItem value="Western Cape">Western Cape</SelectItem>
                        <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                        <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                        <SelectItem value="Free State">Free State</SelectItem>
                        <SelectItem value="Limpopo">Limpopo</SelectItem>
                        <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                        <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                        <SelectItem value="North West">North West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleDataChange({ ...formData, postalCode: e.target.value })}
                      disabled={!isEditingAddress}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleDataChange({ ...formData, country: value })} disabled={!isEditingAddress}>
                    <SelectTrigger id="country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Edit and Save Buttons */}
                <div className="flex justify-end pt-4">
                  {isEditingAddress ? (
                    <div className="flex gap-3">
                      <Button onClick={handleAddressCancelEdit} variant="outline" size="lg" className="px-8">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleAddressSaveClick} size="lg" className="px-8">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleAddressEdit} size="lg" className="px-8">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Address
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc">
            <Card className="p-8 relative">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-primary">Coming Soon</h3>
                  <p className="text-muted-foreground">KYC verification will be available soon</p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-6 text-center">Know Your Customer (KYC)</h2>
              
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <p className="text-muted-foreground">
                    KYC verification helps us keep your account secure and compliant with financial regulations.
                  </p>
                  <Button className="mt-4" variant="outline">
                    Start KYC Verification
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tax Info Tab */}
          <TabsContent value="tax">
            <Card className="p-8 relative">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-primary">Coming Soon</h3>
                  <p className="text-muted-foreground">Tax information will be available soon</p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-6 text-center">Tax Information</h2>
              
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <p className="text-muted-foreground">
                    Tax information will be available for verified accounts.
                  </p>
                  <Button className="mt-4" variant="outline">
                    Add Tax Information
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Bank Accounts Tab */}
          <TabsContent value="bank">
            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-6 text-center">Bank Accounts</h2>
              
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <p className="text-muted-foreground">
                    Link your bank accounts for easy deposits and withdrawals.
                  </p>
                  <Button className="mt-4" variant="outline" onClick={() => navigate('/finances')}>
                    Add Bank Account
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={cancelLeave}
              variant="outline"
            >
              Stay
            </Button>
            <Button
              type="button"
              onClick={confirmLeave}
            >
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to discard all changes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowCancelDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmCancel}
            >
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save all changes? For safety reasons, you are only allowed one edit per week.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowSaveDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmSave}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showWeeklyLimitDialog} onOpenChange={setShowWeeklyLimitDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Weekly Edit Limit</DialogTitle>
            <DialogDescription>
              You can only edit your profile once every 7 days. You can edit again in {daysUntilNextEdit()} days.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowWeeklyLimitDialog(false)}
              variant="outline"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddressSaveDialog} onOpenChange={setShowAddressSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save all changes? For safety reasons, you are only allowed one edit per week.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowAddressSaveDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmAddressSave}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddressCancelDialog} onOpenChange={setShowAddressCancelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to discard all changes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowAddressCancelDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmAddressCancel}
            >
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
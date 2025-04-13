import React, { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Chip
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import visionService, { FoodAnalysisResult, OpenRouterModelConfig } from "../../services/VisionService";
import { openRouterApiKey } from "../../../lib/config";
import "../../../css/calai.css";

// Import directly from process.env for a failsafe approach
const DIRECT_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

export default function CalAiPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FoodAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Model selection with direct access to env variables as fallback
  const [modelConfig, setModelConfig] = useState<OpenRouterModelConfig>({
    modelId: 'google/gemini-pro-vision',  // Default to Gemini Pro Vision
    apiKey: openRouterApiKey || DIRECT_API_KEY || ''
  });

  // Additional state for tracking loading status with more detail
  const [loadingStatus, setLoadingStatus] = useState('');

  // Additional state for tracking API initialization
  const [isApiInitialized, setIsApiInitialized] = useState(false);

  // Initialize API key on component mount with enhanced debugging
  useEffect(() => {
    // Log API key availability without exposing values
    console.log("OpenRouter API key available:", !!openRouterApiKey);
    console.log("Direct env API key available:", !!DIRECT_API_KEY);
    
    // Get all possible API key sources
    const bestApiKey = openRouterApiKey || DIRECT_API_KEY || '';
    
    // Update model config with the best API key, always use Gemini Pro Vision
    setModelConfig(prev => ({
      ...prev,
      modelId: 'google/gemini-pro-vision',
      apiKey: bestApiKey
    }));
    
    setIsApiInitialized(true);
    
    // Initialize service with API key and verify connectivity
    visionService.setConfig({ apiKey: bestApiKey });
    
    // Test API connectivity
    const testConnectivity = async () => {
      try {
        // Use the API key but don't log its value
        visionService.logApiKeyStatus();
        console.log("API key configuration complete. Testing connectivity...");
        
        // Simple fetch to test connectivity to OpenRouter
        const response = await fetch('https://openrouter.ai/', {
          method: 'HEAD'
        });
        
        if (response.ok) {
          console.log("OpenRouter connectivity test successful!");
          return true;
        } else {
          console.warn(`OpenRouter connectivity test failed with status: ${response.status}`);
          return false;
        }
      } catch (err) {
        console.error("OpenRouter connectivity test failed:", err);
        return false;
      }
    };
    
    // Run connectivity test
    testConnectivity();
  }, []);

  // Handle image upload with better validation
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please use an image under 5MB.");
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload a JPEG or PNG image.");
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
          setResults(null); // Reset results when new image is uploaded
          setError(null); // Reset any errors
        }
      };
      
      reader.onerror = () => {
        setError("Failed to read the image file. Please try another image.");
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Analyze image using AI vision model - with enhanced status updates and retries
  const analyzeImage = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setError(null);
    setLoadingStatus('Starting analysis...');
    
    // Clear previous results to ensure user sees the change
    setResults(null);
    
    // Generate a unique request ID for this analysis
    const requestId = Date.now().toString();
    console.log(`Starting analysis for request ${requestId}`);
    
    // Maximum number of retries
    const maxRetries = 2;
    let retryCount = 0;
    
    // Retry loop
    while (retryCount <= maxRetries) {
      try {
        // Always use the environment variable API key
        const apiKey = openRouterApiKey || DIRECT_API_KEY || '';
        
        // Create a fixed retryMessage to avoid closure capturing the changing retryCount
        const retryMessage = retryCount > 0 ? `Retry ${retryCount}/${maxRetries}: ` : '';
        setLoadingStatus(`${retryMessage}Preparing image for analysis...`);
        
        console.log(`Request ${requestId}: Preparing image${retryCount > 0 ? ` (Retry ${retryCount}/${maxRetries})` : ''}`);
        
        // Use the API key from environment variables
        visionService.setConfig({ 
          modelId: 'google/gemini-pro-vision',
          apiKey: apiKey
        });
        
        // Call the vision service with the image
        setLoadingStatus(`${retryMessage}Sending to OpenRouter API (request ${requestId})...`);
        
        console.log(`Request ${requestId}: Calling API${retryCount > 0 ? ` (Retry ${retryCount}/${maxRetries})` : ''}`);
        
        // Wrap API call in a timeout promise to avoid UI hanging
        const analysisResults = await Promise.race([
          visionService.analyzeFood(image),
          new Promise<FoodAnalysisResult>((_, reject) => {
            // Set a timeout in case the API call hangs
            setTimeout(() => {
              reject(new Error("Analysis request timed out. Please try again."));
            }, 120000); // 2 minutes timeout
          })
        ]);
        
        setLoadingStatus('Processing results...');
        console.log(`Request ${requestId}: Results received:`, analysisResults);
        
        // Check for mock results (fallback from network error)
        const isMockResult = 
          analysisResults.foodName.includes("Estimated") ||
          analysisResults.foodName === "Pizza" ||
          analysisResults.foodName === "Burger" ||
          analysisResults.foodName === "Salad" ||
          analysisResults.foodName === "Pasta" ||
          analysisResults.foodName === "Steak" ||
          analysisResults.foodName === "Sushi";
          
        if (isMockResult) {
          console.warn(`Request ${requestId}: Detected mock results due to network issue. Showing simulated results.`);
          // Show a warning to the user but still display the results
          setError("Network connectivity issue detected. Showing estimated nutritional information. Results may not be accurate.");
        }
        
        // Check if the result is valid
        if (!analysisResults.foodName || 
            (analysisResults.calories === 0 && 
             analysisResults.protein === 0 && 
             analysisResults.carbs === 0 && 
             analysisResults.fat === 0)) {
          throw new Error("Could not analyze the food in this image. Please try a clearer image of a food item.");
        }
        
        // Set results with a delay to ensure UI updates properly
        setTimeout(() => {
          setResults(analysisResults);
          setLoadingStatus('Analysis complete');
          console.log(`Request ${requestId}: Analysis completed successfully`);
        }, 100);
        
        // If we got here, we succeeded, so break out of the retry loop
        break;
        
      } catch (err: any) {
        console.error(`Request ${requestId}: Error analyzing food image (try ${retryCount}):`, err);
        
        // Check if we should retry
        if (retryCount < maxRetries && 
            (err.message?.includes('Network Error') || 
             err.message?.includes('timeout') || 
             err.message?.includes('404'))) {
          // Increment retry count before creating message to avoid closure issue
          const currentRetry = retryCount + 1;
          retryCount = currentRetry;
          const retryMsg = `Retry ${currentRetry}/${maxRetries}: Reconnecting...`;
          setLoadingStatus(retryMsg);
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry));
          continue;
        }
        
        setLoadingStatus('Analysis failed');
        
        // Detailed error handling
        let errorMessage = 'Failed to analyze image. Please try again.';
        
        if (err.message) {
          if (err.message.includes('Network Error')) {
            errorMessage = 'Network error: Please check your internet connection and try again.';
          } else if (err.message.includes('timeout')) {
            errorMessage = 'The request timed out. The server might be busy, please try again later.';
          } else if (err.message.includes('API error')) {
            errorMessage = `API error: ${err.message.split('API error:')[1] || 'Please try again later.'}`;
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        break;
      } 
    }
    
    setIsAnalyzing(false);
  };

  // Reset everything
  const handleReset = () => {
    setImage(null);
    setResults(null);
    setError(null);
  };

  // Add a warning if the API key hasn't been properly initialized
  if (!isApiInitialized && !modelConfig.apiKey) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          API key not properly initialized. Please check your environment configuration and reload the page.
        </Alert>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">Configuration Status</Typography>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '200px', overflow: 'auto' }}>
            Config API key: {!!openRouterApiKey ? "Available" : "Missing"}
            Direct env API key: {!!DIRECT_API_KEY ? "Available" : "Missing"}
          </pre>
        </Paper>
      </Container>
    );
  }

  return (
    <div className={"calai-page"}>
      <Container className={"calai-container"}>
        <Box className={"calai-content"}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, minHeight:'750px' }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Calorie AI
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Track your calories with just a picture
              </Typography>
              {/* Show the model being used */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Powered by Cal AI - Alex   
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* Left Column - Upload & Results */}
              <Grid item xs={12} md={6}>
                <Box mb={4}>
                  <Typography variant="h6" gutterBottom>
                    How it works:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="1. Take or upload a photo of your meal" 
                        secondary="The clearer the image, the better the analysis"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="2. Our AI analyzes your food" 
                        secondary="We identify ingredients and portion sizes"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="3. Get detailed nutritional information" 
                        secondary="Calories, protein, carbs, fat and more"
                      />
                    </ListItem>
                  </List>
                </Box>

                {/* Upload Area */}
                <Box 
                  sx={{ 
                    border: '2px dashed #ccc', 
                    borderRadius: 2, 
                    p: 3, 
                    textAlign: 'center',
                    mb: 3,
                    backgroundColor: '#f8f8ff',
                    minHeight:'300px',
                    display:'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {!image ? (
                    <>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-upload"
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="image-upload">
                        <Button 
                          variant="contained" 
                          component="span"
                          startIcon={<CameraAltIcon />}
                          sx={{ mb: 2 }}
                        >
                          Upload Food Image
                        </Button>
                      </label>
                      <Typography variant="body2" color="text.secondary">
                        or drag and drop an image here
                      </Typography>
                      
                      {/* Show error if any */}
                      {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                          {error}
                        </Alert>
                      )}
                    </>
                  ) : (
                    <Box>
                      <img 
                        src={image} 
                        alt="Food" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '180px', 
                          borderRadius: '8px' 
                        }} 
                      />
                      <Box mt={2} display="flex" justifyContent="center" gap={2}>
                        <Button 
                          variant="outlined" 
                          color="secondary"
                          onClick={handleReset}
                        >
                          Change Image
                        </Button>
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={analyzeImage}
                          disabled={isAnalyzing}
                          startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <RestaurantIcon />}
                        >
                          {isAnalyzing ? "Analyzing..." : "Analyze Food"}
                        </Button>
                      </Box>
                      
                      {/* Show loading status */}
                      {isAnalyzing && loadingStatus && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {loadingStatus}
                        </Typography>
                      )}
                      
                      {/* Show error if any */}
                      {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                          {error}
                        </Alert>
                      )}
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Right Column - Results */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    height: '95%', 
                    minHeight:'300px',
                    backgroundColor: results ? '#f9f9f9' : 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: results ? 'flex-start' : 'center',
                    alignItems: results ? 'flex-start' : 'center'
                  }}
                >
                  {results ? (
                    <>
                      <Typography variant="h5" gutterBottom color="primary">
                        Nutritional Information
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {results.foodName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Analyzed by Cal AI at  {new Date().toLocaleTimeString()}
                      </Typography>
                      <Divider sx={{ width: '100%', my: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Calories
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {results.calories} kcal
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Protein
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {results.protein}g
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Carbohydrates
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {results.carbs}g
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Fat
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {results.fat}g
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {/* Display ingredients if available */}
                      {results.ingredients && results.ingredients.length > 0 && (
                        <Box mt={3} width="100%">
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Ingredients
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {results.ingredients.map((ingredient, index) => (
                              <Chip 
                                key={index} 
                                label={ingredient} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      <Box mt={4} width="100%">
                        <Typography variant="body2" gutterBottom>
                          Want more accurate results?
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          placeholder="Describe your meal for better analysis"
                          sx={{ mb: 2 }}
                        />
                        <Button variant="contained" color="primary" fullWidth>
                          Improve Results
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box textAlign="center" p={3}>
                      <RestaurantIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Analysis Yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Upload a photo of your food and click "Analyze Food" to see nutritional information
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

import React, { useState } from "react";
import {
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import "./App.css";

function App() {
  const [searchType, setSearchType] = useState("pincode");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [branchType, setBranchType] = useState(""); // For filtering by branch type
  const [availableBranchTypes, setAvailableBranchTypes] = useState([]); // Store available branch types

  const handleSearch = async (event) => {
    event.preventDefault();

    let apiUrl =
      searchType === "pincode"
        ? `https://api.postalpincode.in/pincode/${input}`
        : `https://api.postalpincode.in/postoffice/${input}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data[0].Status === "Success") {
        setResult(data[0].PostOffice);
        setError(null);
        // Extract unique branch types from the search result
        const uniqueBranchTypes = [
          ...new Set(data[0].PostOffice.map((office) => office.BranchType)),
        ];
        setAvailableBranchTypes(uniqueBranchTypes); // Store branch types
      } else {
        setError(data[0].Message);
        setResult(null);
        setAvailableBranchTypes([]); // Clear available branch types if no results
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setResult(null);
      setAvailableBranchTypes([]); // Clear available branch types if there's an error
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setError(null);
    setBranchType(""); // Reset branch type filter
    setAvailableBranchTypes([]); // Clear branch types when clearing the form
  };

  // Function to filter results by branch type
  const filteredResults = () => {
    if (!branchType) return result; // If no filter is applied, return all results
    return result.filter((office) => office.BranchType === branchType);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Postal PIN Code or Post Office
        </Typography>

        <form onSubmit={handleSearch}>
          <RadioGroup
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            row
          >
            <FormControlLabel
              value="pincode"
              control={<Radio />}
              label="Search by PIN Code"
            />
            <FormControlLabel
              value="postoffice"
              control={<Radio />}
              label="Search by Post Office Branch Name"
            />
          </RadioGroup>

          <TextField
            label={
              searchType === "pincode"
                ? "Enter PIN code"
                : "Enter Post Office Branch Name"
            }
            variant="outlined"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            margin="normal"
            required
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </form>

        {/* Display branch type filter after results are rendered */}
        {result && availableBranchTypes.length > 0 && (
          <Grid container alignItems="center" spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={4}>
              <Typography>Filter by Branch Type:</Typography>
            </Grid>
            <Grid item xs={8}>
              <FormControl fullWidth>
                <Select
                  value={branchType}
                  onChange={(e) => setBranchType(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">All</MenuItem>
                  {availableBranchTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {/* Display results or errors */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {result && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Search Results:</Typography>
            <ul>
              {filteredResults().map((office, index) => (
                <li key={index}>
                  <Typography>
                    <strong>{office.Name}</strong>
                    <br />
                    Branch Type: {office.BranchType}
                    <br />
                    Delivery Status: {office.DeliveryStatus}
                    <br />
                    Division: {office.Division}
                    <br />
                    District: {office.District}
                    <br />
                    State: {office.State}
                    <br />
                    Country: {office.Country}
                    <br />
                    {office.PINCode && (
                      <>
                        PIN Code: {office.PINCode}
                        <br />
                      </>
                    )}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;

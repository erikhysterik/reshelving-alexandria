# Deployment to Vercel

## Prerequisites
- Vercel account
- MySQL database (Aiven, PlanetScale, or similar)

## Environment Variables Setup

In your Vercel project settings, add these environment variables:

### Database Configuration
```
MYSQL_HOST=your-database-host
MYSQL_USER=your-database-user
MYSQL_PW=your-database-password
MYSQL_DB=your-database-name
MYSQL_PORT=3306
```

### Algolia Search (Optional)
```
NEXT_PUBLIC_ALGOLIA_APP_ID=your-algolia-app-id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your-algolia-search-key
```

## Deployment Steps

1. **Connect Repository to Vercel**
   - Go to vercel.com and sign in
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (leave default)

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all the database variables listed above
   - Set environment to "Production", "Preview", and "Development"

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - The first build may take longer due to static page generation

## Cost Optimization

This setup is designed for cost efficiency:

- **Free Tier**: Vercel offers 100GB bandwidth and 100GB build hours/month
- **Static Generation**: All pages are pre-built, minimizing runtime costs
- **Infrequent Builds**: Only rebuild when content changes

## Expected Build Time

- Initial build: 10-30 minutes (generating 10k+ static pages)
- Subsequent builds: 5-15 minutes
- Runtime: Essentially free (static hosting)

## Troubleshooting

### Build Fails
- Check database connectivity
- Verify environment variables are set correctly
- Ensure MySQL server allows connections from Vercel's IP ranges

### Database Connection Issues
- Use a cloud database service (Aiven, PlanetScale) that allows external connections
- Check firewall settings
- Verify credentials

### Performance Issues
- The static generation timeout is set to 10 minutes in `next.config.js`
- If you have more than 10k pages, you may need to increase this limit
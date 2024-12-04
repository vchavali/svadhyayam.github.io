import sys

if __name__=='__main__':
    if len(sys.argv) == 1:
        print("no annotation file provided!")
        sys.exit()

    annotation_file = sys.argv[1]
    
